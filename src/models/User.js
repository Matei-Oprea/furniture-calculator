const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getAll, getOne, runQuery } = require('../utils/db');

class User
{
  // Find user by ID
  static async findById(id)
  {
    return await getOne('SELECT * FROM users WHERE id = ?', [id]);
  }

  // Find user by email
  static async findByEmail(email)
  {
    return await getOne('SELECT * FROM users WHERE email = ?', [email]);
  }

  // Create user
  static async create({ name, surname, email, phone, password, role = 'customer' })
  {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await runQuery(
      `INSERT INTO users (name, surname, email, phone, password, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, surname, email, phone, hashedPassword, role]
    );

    return this.findById(result.id);
  }

  // Update user
  static async update(id, userData)
  {
    const updates = [];
    const values = [];

    // Handle password separately
    if (userData.password)
    {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      updates.push('password = ?');
      values.push(hashedPassword);
      delete userData.password;
    }

    // Handle other fields
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined)
      {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updates.length === 0)
    {
      return await this.findById(id);
    }

    values.push(id);
    await runQuery(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  // Delete user
  static async delete(id)
  {
    return await runQuery('DELETE FROM users WHERE id = ?', [id]);
  }

  // Compare password
  static async comparePassword(candidatePassword, hashedPassword)
  {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  // Generate auth token
  static generateToken(userId)
  {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
  }
}

module.exports = User;