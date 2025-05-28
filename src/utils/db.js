const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a database connection
const db = new sqlite3.Database(
    path.join(__dirname, '../../data/furniture_calculator.db'),
    sqlite3.OPEN_READWRITE,
    (err) => {
        if (err) {
            console.error('Error connecting to the database:', err.message);
        } else {
            console.log('Connected to the SQLite database.');
        }
    }
);

// Helper function to run queries with promises
const runQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, changes: this.changes });
            }
        });
    });
};

// Helper function to get single row
const getOne = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

// Helper function to get multiple rows
const getAll = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

module.exports = {
    db,
    runQuery,
    getOne,
    getAll
};