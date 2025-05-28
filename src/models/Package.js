const { getAll, getOne, runQuery } = require('../utils/db');

class Package {
  // Get all packages
  static async getAll() {
    return await getAll('SELECT * FROM packages ORDER BY created_at DESC');
  }

  // Get package by ID
  static async getById(id) {
    return await getOne('SELECT * FROM packages WHERE id = ?', [id]);
  }

  // Get packages by room dimensions
  static async getByDimensions(length, height) {
    return await getAll(
      'SELECT * FROM packages WHERE room_length >= ? AND room_height >= ?',
      [length, height]
    );
  }

  // Create package
  static async create(packageData) {
    const { name, description, type, room_length, room_height, price, image_urls } = packageData;

    // Convert image_urls array to JSON string if it's not already
    const imageUrlsJson = typeof image_urls === 'string'
      ? image_urls
      : JSON.stringify(image_urls || []);

    const result = await runQuery(
      `INSERT INTO packages (name, description, type, room_length, room_height, price, image_urls)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description, type, room_length, room_height, price, imageUrlsJson]
    );

    return this.getById(result.id);
  }

  // Update package
  static async update(id, packageData) {
    const { name, description, type, room_length, room_height, price, image_urls } = packageData;

    // Convert image_urls array to JSON string if it's not already
    const imageUrlsJson = typeof image_urls === 'string'
      ? image_urls
      : JSON.stringify(image_urls || []);

    await runQuery(
      `UPDATE packages
       SET name = ?,
           description = ?,
           type = ?,
           room_length = ?,
           room_height = ?,
           price = ?,
           image_urls = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, description, type, room_length, room_height, price, imageUrlsJson, id]
    );

    return this.getById(id);
  }

  // Delete package
  static async delete(id) {
    return await runQuery('DELETE FROM packages WHERE id = ?', [id]);
  }
}

module.exports = Package;