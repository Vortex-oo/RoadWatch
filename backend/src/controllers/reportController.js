const { uploadImage } = require("../services/imageService");

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

    if (bounds) {
      const [swLng, swLat, neLng, neLat] = bounds.split(',').map(Number);
      query.location = {
        $geoWithin: {
          $box: [
            [swLng, swLat],
            [neLng, neLat]
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
        const { description, latitude, longitude, severity } = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a pothole image",
            });
        }

        if (
            !Number.isFinite(Number(latitude)) ||
            !Number.isFinite(Number(longitude))
        ) {
            return res.status(400).json({
                message: "Valid latitude and longitude are required",
            });
        }

        // Upload image to Cloudinary
        const uploadedImage = await uploadImage(req.file.buffer);

        // Find nearby existing report
        const existingReport = await Report.findOne({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [Number(longitude), Number(latitude)],
                    },
                    $maxDistance: 10,
                },
            },
        });

        if (existingReport) {
            if (existingReport.confirmations.includes(req.user.id)) {
                return res.status(400).json({
                    message: "You have already reported or voted for this issue.",
                });
            }

            existingReport.votes += 1;
            existingReport.confirmations.push(req.user.id);

            await existingReport.save();

            return res.status(200).json({
                message: "Similar report found. Vote increased.",
                report: existingReport,
            });
        }

        const report = new Report({
            description,
            photo: uploadedImage.secure_url,
            severity,
            location: {
                type: "Point",
                coordinates: [
                    Number(longitude),
                    Number(latitude),
                ],
            },
            author: req.user.id,
            confirmations: [req.user.id],
            votes: 1,
        });

        await report.save();

        res.status(201).json({
            message: "Report created successfully",
            report,
        });

    } catch (error) {
        console.error("Report creation error:", error);

        res.status(500).json({
            message: "Error creating report",
            error: error.message,
        });
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
        imageUrl: report.photo || '',
        severity: report.severity,
        status: report.status === 'pending' ? 'reported' : report.status,
        priorityScore: Number(priorityScore.toFixed(1)),
        confirmationCount: report.votes,
        description: report.description || '',
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
    const { latitude, longitude, maxDistance = 500 } = req.query;

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