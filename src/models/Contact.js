const pool = require('../config/db');

class Contact {
  // Get all contacts
  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM contacts ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get contact by ID
  static async getById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM contacts WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create contact
  static async create(contactData) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO contacts (name, email, message, status) VALUES (?, ?, ?, ?)',
        [
          contactData.name,
          contactData.email,
          contactData.message,
          contactData.status || 'new'
        ]
      );

      return await Contact.getById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Update contact status
  static async updateStatus(id, status) {
    try {
      await pool.execute('UPDATE contacts SET status = ? WHERE id = ?', [status, id]);
      return await Contact.getById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete contact
  static async delete(id) {
    try {
      await pool.execute('DELETE FROM contacts WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Contact;