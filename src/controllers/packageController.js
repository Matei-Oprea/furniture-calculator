const Package = require('../models/Package');

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.getAll();
    
    // Parse image_urls JSON
    packages.forEach(pkg => {
      if (pkg.image_urls && typeof pkg.image_urls === 'string') {
        try {
          pkg.image_urls = JSON.parse(pkg.image_urls);
        } catch (e) {
          pkg.image_urls = [];
        }
      }
    });

    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get package by ID
// @route   GET /api/packages/:id
// @access  Public
exports.getPackageById = async (req, res) => {
  try {
    const package = await Package.getById(req.params.id);

    if (!package) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    // Parse image_urls JSON
    if (package.image_urls && typeof package.image_urls === 'string') {
      try {
        package.image_urls = JSON.parse(package.image_urls);
      } catch (e) {
        package.image_urls = [];
      }
    }

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get packages by room dimensions
// @route   GET /api/packages/dimensions
// @access  Public
exports.getPackagesByDimensions = async (req, res) => {
  try {
    const { length, height } = req.query;

    if (!length || !height) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide both length and height' 
      });
    }

    const packages = await Package.getByDimensions(length, height);
    
    // Parse image_urls JSON
    packages.forEach(pkg => {
      if (pkg.image_urls && typeof pkg.image_urls === 'string') {
        try {
          pkg.image_urls = JSON.parse(pkg.image_urls);
        } catch (e) {
          pkg.image_urls = [];
        }
      }
    });

    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create new package
// @route   POST /api/packages
// @access  Private/Admin
exports.createPackage = async (req, res) => {
  try {
    const package = await Package.create(req.body);

    // Parse image_urls JSON for response
    if (package.image_urls && typeof package.image_urls === 'string') {
      try {
        package.image_urls = JSON.parse(package.image_urls);
      } catch (e) {
        package.image_urls = [];
      }
    }

    res.status(201).json({
      success: true,
      data: package
    });
  } catch (error) {
    console.error(error);
    
    if (error.code === 'ER_BAD_NULL_ERROR') {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private/Admin
exports.updatePackage = async (req, res) => {
  try {
    // Check if package exists
    let package = await Package.getById(req.params.id);

    if (!package) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    // Update package
    package = await Package.update(req.params.id, req.body);

    // Parse image_urls JSON for response
    if (package.image_urls && typeof package.image_urls === 'string') {
      try {
        package.image_urls = JSON.parse(package.image_urls);
      } catch (e) {
        package.image_urls = [];
      }
    }

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
exports.deletePackage = async (req, res) => {
  try {
    // Check if package exists
    const package = await Package.getById(req.params.id);

    if (!package) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    // Delete package
    await Package.delete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};