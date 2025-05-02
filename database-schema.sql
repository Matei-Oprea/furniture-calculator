CREATE DATABASE IF NOT EXISTS furniture_calculator;
USE furniture_calculator;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  surname VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(50),
  room_length DECIMAL(10,2) NOT NULL,
  room_height DECIMAL(10,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_urls JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  package_id INT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_date DATE NOT NULL,
  observation TEXT,
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (package_id) REFERENCES packages(id)
);

CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'read', 'replied') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user (password: admin123)
INSERT INTO users (name, surname, email, phone, password, role) 
VALUES ('Admin', 'User', 'admin@example.com', '123456789', '$2b$10$xLtQHRjO/kI5V8qD5bMQAeujo.6RKQoJ5rKXQPeKLQgC7jEKDdnZK', 'admin');

-- Insert sample packages
INSERT INTO packages (name, description, type, room_length, room_height, price, image_urls) VALUES
('Small Living Room', 'Perfect for small apartments', 'Living Room', 3.5, 2.5, 1299.99, '["livingroom1.jpg", "livingroom2.jpg"]'),
('Medium Bedroom', 'Comfortable bedroom set', 'Bedroom', 4.0, 2.8, 1599.99, '["bedroom1.jpg", "bedroom2.jpg"]'),
('Large Kitchen', 'Complete kitchen set', 'Kitchen', 5.0, 3.0, 2499.99, '["kitchen1.jpg", "kitchen2.jpg"]');