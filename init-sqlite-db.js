const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// Create the data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const db = new sqlite3.Database(path.join(dataDir, 'furniture_calculator.db'));

const initializeDatabase = () => {
    db.serialize(() => {
        // Create users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            surname TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT,
            password TEXT NOT NULL,
            role TEXT CHECK(role IN ('customer', 'admin')) DEFAULT 'customer',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Create packages table
        db.run(`CREATE TABLE IF NOT EXISTS packages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            type TEXT,
            room_length REAL NOT NULL,
            room_height REAL NOT NULL,
            price REAL NOT NULL,
            image_urls TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Create orders table
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            package_id INTEGER NOT NULL,
            delivery_address TEXT NOT NULL,
            delivery_date DATE NOT NULL,
            observation TEXT,
            status TEXT CHECK(status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (package_id) REFERENCES packages(id)
        )`);

        // Create contacts table
        db.run(`CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            status TEXT CHECK(status IN ('new', 'read', 'replied')) DEFAULT 'new',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Insert admin user (password: admin123)
        const adminPassword = '$2b$10$xLtQHRjO/kI5V8qD5bMQAeujo.6RKQoJ5rKXQPeKLQgC7jEKDdnZK';
        db.run(`INSERT OR IGNORE INTO users (name, surname, email, phone, password, role)
                VALUES (?, ?, ?, ?, ?, ?)`,
            ['Admin', 'User', 'admin@example.com', '123456789', adminPassword, 'admin']);

        // Insert sample packages
        const samplePackages = [
            ['Small Living Room', 'Perfect for small apartments', 'Living Room', 3.5, 2.5, 1299.99, '["livingroom1.jpg", "livingroom2.jpg"]'],
            ['Medium Bedroom', 'Comfortable bedroom set', 'Bedroom', 4.0, 2.8, 1599.99, '["bedroom1.jpg", "bedroom2.jpg"]'],
            ['Large Kitchen', 'Complete kitchen set', 'Kitchen', 5.0, 3.0, 2499.99, '["kitchen1.jpg", "kitchen2.jpg"]']
        ];

        const insertPackageStmt = db.prepare(`INSERT OR IGNORE INTO packages
            (name, description, type, room_length, room_height, price, image_urls)
            VALUES (?, ?, ?, ?, ?, ?, ?)`);

        samplePackages.forEach(package => {
            insertPackageStmt.run(package);
        });

        insertPackageStmt.finalize();
    });

    console.log('Database initialized successfully!');
};

initializeDatabase();

// Export the database connection
module.exports = db;