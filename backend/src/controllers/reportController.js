const Report = require('../models/Report');

exports.getReports = async (req, res) => {
  try {
    const { status, severity, from, to, bounds, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (severity) query.severity = severity;
    
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    // bounds format expected: sw_lng,sw_lat,ne_lng,ne_lat (SouthWest to NorthEast)
    if (bounds) {
      const [swLng, swLat, neLng, neLat] = bounds.split(',').map(Number);
      query.location = {
        $geoWithin: {
          $box: [
            [swLng, swLat], // Bottom left
            [neLng, neLat]  // Top right
          ]
        }
      };
    }

    const reports = await Report.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('author', 'username');
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const resolvedReports = await Report.countDocuments({ status: 'resolved' });
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    
    res.status(200).json({ totalReports, resolvedReports, pendingReports });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

exports.createReport = async (req, res) => {
  try {
    const { description, photo, latitude, longitude, severity } = req.body;

    // 1. Check if a report already exists within 10 meters of these coordinates
    const existingReport = await Report.findOne({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: 10 // Adjust this radius in meters if needed
        }
      }
    });

    if (existingReport) {
      // 2. Prevent the exact same user from boosting the vote count infinitely
      if (existingReport.confirmations.includes(req.user.id)) {
        return res.status(400).json({ 
          message: 'You have already reported or voted for this issue.' 
        });
      }

      // 3. Increase the vote count and save the user's ID
      existingReport.votes += 1;
      existingReport.confirmations.push(req.user.id);
      
      await existingReport.save();
      
      return res.status(200).json({ 
        message: 'Similar report found nearby. Vote increased instead of creating a duplicate.', 
        report: existingReport 
      });
    }

    // 4. If no report is found, run your original creation logic
    const report = new Report({
      description,
      photo,
      severity,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude] // GeoJSON is strictly [lng, lat]
      },
      author: req.user.id, // Pulled from the verifyToken middleware
      confirmations: [req.user.id] // Automatically add the creator so they can't vote again later
    });

    await report.save();
    res.status(201).json({ message: 'Report created successfully', report });
  } catch (error) {
    res.status(500).json({ message: 'Error creating report', error: error.message });
  }
};

exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({}).sort({ createdAt: -1 });

    const validReports = reports.filter(report => {
      const coords = report?.location?.coordinates;
      return Array.isArray(coords)
        && coords.length === 2
        && Number.isFinite(coords[0])
        && Number.isFinite(coords[1]);
    });

    const formattedReports = validReports.map(report => {
      const severityMultiplier = report.severity === 'high' ? 3 : report.severity === 'medium' ? 2 : 1;
      const priorityScore = (severityMultiplier * 2) + (report.votes * 0.5);

      return {
        id: report._id.toString(),
        latitude: report.location.coordinates[1],
        longitude: report.location.coordinates[0],
        imageUrl: report.photo || "",
        severity: report.severity,
        status: report.status === 'pending' ? 'reported' : report.status,
        priorityScore: Number(priorityScore.toFixed(1)),
        confirmationCount: report.votes,
        description: report.description || "",
        createdAt: report.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      count: formattedReports.length,
      reports: formattedReports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message
    });
  }
};

exports.getNearbyReports = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 500 } = req.query; // maxDistance in meters

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const reports = await Report.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [Number(longitude), Number(latitude)] },
          $maxDistance: Number(maxDistance)
        }
      }
    });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching nearby reports', error: error.message });
  }
};

exports.confirmReport = async (req, res) => {
  try {
    // $addToSet ensures the user ID is only added once (preventing multiple upvotes from one user)
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { confirmations: req.user.id } },
      { new: true }
    );

    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.status(200).json({ message: 'Report confirmed', confirmationsCount: report.confirmations.length });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming report' });
  }
};