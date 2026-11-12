const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken } = require('../middlewares/authMiddleware');
const upload = require("../middlewares/uploadMiddleware");


// Public routes
router.get('/', reportController.getMyReports);

// Citizen routes (Protected)
// Note: Being logged in implies you are at least a citizen, so verifyToken handles this requirement.
router.post(
    "/",
    verifyToken,
    upload.single("photo"),
    reportController.createReport
);
router.get('/mine', verifyToken, reportController.getMyReports);
router.get('/nearby', verifyToken, reportController.getNearbyReports);

// Routes with /:id parameters must come last
router.get('/:id', reportController.getReportById); // Public
router.post('/:id/confirm', verifyToken, reportController.confirmReport); // Citizen

module.exports = router;