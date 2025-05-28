const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const initializeAdmin = async () => {
    const db = new sqlite3.Database(path.join(__dirname, 'data/furniture_calculator.db'));

    try {
        // Hash the admin password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Insert or update admin user
        db.run(`
            INSERT OR REPLACE INTO users (name, surname, email, phone, password, role)
            VALUES (?, ?, ?, ?, ?, ?)
        `, ['Admin', 'User', 'admin@example.com', '123456789', hashedPassword, 'admin'],
        (err) => {
            if (err) {
                console.error('Error creating admin user:', err.message);
            } else {
                console.log('Admin user created successfully!');
            }
            db.close();
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        db.close();
    }
};

initializeAdmin();