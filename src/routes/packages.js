const express = require('express');
const router = express.Router();
const {
  getAllPackages,
  getPackageById,
  getPackagesByDimensions,
  createPackage,
  updatePackage,
  deletePackage
} = require('../controllers/packageController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllPackages);
router.get('/dimensions', getPackagesByDimensions);
router.get('/:id', getPackageById);

// Admin protected routes
router.post('/', protect, authorize('admin'), createPackage);
router.put('/:id', protect, authorize('admin'), updatePackage);
router.delete('/:id', protect, authorize('admin'), deletePackage);

module.exports = router;