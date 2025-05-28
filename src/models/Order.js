const { getAll, getOne, runQuery } = require('../utils/db');

class Order {
  // Get all orders
  static async getAll() {
    return await getAll(`
      SELECT o.*,
             u.name as user_name, u.email as user_email,
             p.name as package_name, p.price as package_price
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN packages p ON o.package_id = p.id
      ORDER BY o.created_at DESC
    `);
  }

  // Get order by ID
  static async getById(id) {
    return await getOne(`
      SELECT o.*,
             u.name as user_name, u.email as user_email,
             p.name as package_name, p.price as package_price,
             p.image_urls as package_images
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN packages p ON o.package_id = p.id
      WHERE o.id = ?
    `, [id]);
  }

  // Get orders by user ID
  static async getByUserId(userId) {
    return await getAll(`
      SELECT o.*,
             p.name as package_name, p.price as package_price,
             p.image_urls as package_images
      FROM orders o
      JOIN packages p ON o.package_id = p.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [userId]);
  }

  // Create order
  static async create(orderData) {
    const { user_id, package_id, delivery_address, delivery_date, observation } = orderData;

    const result = await runQuery(
      `INSERT INTO orders (user_id, package_id, delivery_address, delivery_date, observation, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [user_id, package_id, delivery_address, delivery_date, observation || null]
    );

    return this.getById(result.id);
  }

  // Update order
  static async update(id, orderData) {
    const updates = [];
    const values = [];

    Object.entries(orderData).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updates.length === 0) {
      return await this.getById(id);
    }

    values.push(id);
    await runQuery(
      `UPDATE orders
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      values
    );

    return this.getById(id);
  }

  // Delete order
  static async delete(id) {
    return await runQuery('DELETE FROM orders WHERE id = ?', [id]);
  }
}

module.exports = Order;