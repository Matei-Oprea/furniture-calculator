const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class User
{
  // Find user by ID
  static async findById(id)
  {
    try
    {
      const [rows] = await pool.execute(
        'SELECT id, name, surname, email, phone, role FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error)
    {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email)
  {
    try
    {
      const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error)
    {
      throw error;
    }
  }

  // Create user
  static async create(userData)
  {
    try
    {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const [result] = await pool.execute(
        'INSERT INTO users (name, surname, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)',
        [
          userData.name,
          userData.surname,
          userData.email,
          userData.phone || '',
          hashedPassword,
          userData.role || 'customer'
        ]
      );

      // Get created user (without password)
      const [rows] = await pool.execute(
        'SELECT id, name, surname, email, phone, role FROM users WHERE id = ?',
        [result.insertId]
      );

      return rows[0];
    } catch (error)
    {
      throw error;
    }
  }

  // Update user
  static async update(id, userData)
  {
    try
    {
      // If password is provided, hash it
      if (userData.password)
      {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
      }

      // Create update query dynamically
      const keys = Object.keys(userData).filter(key => userData[key] !== undefined);
      const values = keys.map(key => userData[key]);

      if (keys.length === 0)
      {
        return await User.findById(id);
      }

      const setClause = keys.map(key => `${key} = ?`).join(', ');
      const updateQuery = `UPDATE users SET ${setClause} WHERE id = ?`;

      await pool.execute(updateQuery, [...values, id]);

      return await User.findById(id);
    } catch (error)
    {
      throw error;
    }
  }

  // Delete user
  static async delete(id)
  {
    try
    {
      await pool.execute('DELETE FROM users WHERE id = ?', [id]);
      return true;
    } catch (error)
    {
      throw error;
    }
  }

  // Compare password
  static async comparePassword(providedPassword, storedPassword)
  {
    return await bcrypt.compare(providedPassword, storedPassword);
  }

  // Generate auth token
  static generateToken(id)
  {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
  }
}

module.exports = User;