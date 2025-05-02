const pool = require('../config/db');

class Package {
  // Get all packages
  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM packages');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get package by ID
  static async getById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM packages WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get packages by room dimensions
  static async getByDimensions(length, height) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM packages WHERE room_length >= ? AND room_height >= ?',
        [length, height]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Create package
  static async create(packageData) {
    try {
      // Convert image_urls to JSON if it's an array
      const image_urls = Array.isArray(packageData.image_urls)
        ? JSON.stringify(packageData.image_urls)
        : packageData.image_urls;

      const [result] = await pool.execute(
        'INSERT INTO packages (name, description, type, room_length, room_height, price, image_urls) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          packageData.name,
          packageData.description || '',
          packageData.type || '',
          packageData.room_length,
          packageData.room_height,
          packageData.price,
          image_urls
        ]
      );

      return await Package.getById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Update package
  static async update(id, packageData) {
    try {
      // Convert image_urls to JSON if it's an array
      if (packageData.image_urls && Array.isArray(packageData.image_urls)) {
        packageData.image_urls = JSON.stringify(packageData.image_urls);
      }

      // Create update query dynamically
      const keys = Object.keys(packageData).filter(key => packageData[key] !== undefined);
      const values = keys.map(key => packageData[key]);

      if (keys.length === 0) {
        return await Package.getById(id);
      }

      const setClause = keys.map(key => `${key} = ?`).join(', ');
      const updateQuery = `UPDATE packages SET ${setClause} WHERE id = ?`;

      await pool.execute(updateQuery, [...values, id]);

      return await Package.getById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete package
  static async delete(id) {
    try {
      await pool.execute('DELETE FROM packages WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Package;