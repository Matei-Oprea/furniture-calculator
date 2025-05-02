const pool = require('../config/db');

class Order {
  // Get all orders
  static async getAll() {
    try {
      const [rows] = await pool.execute(`
        SELECT o.*, u.name AS user_name, u.email AS user_email, p.name AS package_name 
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN packages p ON o.package_id = p.id
        ORDER BY o.created_at DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get order by ID
  static async getById(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT o.*, u.name AS user_name, u.email AS user_email, p.name AS package_name 
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN packages p ON o.package_id = p.id
        WHERE o.id = ?
      `, [id]);
      
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get orders by user ID
  static async getByUserId(userId) {
    try {
      const [rows] = await pool.execute(`
        SELECT o.*, p.name AS package_name, p.price, p.image_urls
        FROM orders o
        JOIN packages p ON o.package_id = p.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
      `, [userId]);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Create order
  static async create(orderData) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO orders (user_id, package_id, delivery_address, delivery_date, observation, status) VALUES (?, ?, ?, ?, ?, ?)',
        [
          orderData.user_id,
          orderData.package_id,
          orderData.delivery_address,
          orderData.delivery_date,
          orderData.observation || '',
          orderData.status || 'pending'
        ]
      );

      return await Order.getById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Update order
  static async update(id, orderData) {
    try {
      // Create update query dynamically
      const keys = Object.keys(orderData).filter(key => orderData[key] !== undefined);
      const values = keys.map(key => orderData[key]);

      if (keys.length === 0) {
        return await Order.getById(id);
      }

      const setClause = keys.map(key => `${key} = ?`).join(', ');
      const updateQuery = `UPDATE orders SET ${setClause} WHERE id = ?`;

      await pool.execute(updateQuery, [...values, id]);

      return await Order.getById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete order
  static async delete(id) {
    try {
      await pool.execute('DELETE FROM orders WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Order;