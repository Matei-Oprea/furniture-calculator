import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public pages
import Home from './pages/customer/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Contact from './pages/customer/Contact';
import NotFound from './pages/NotFound';

// Customer pages
import Orders from './pages/customer/Orders';

// Admin pages
import PackageCatalog from './pages/producer/PackageCatalog';
import OrderManagement from './pages/producer/OrderManagement';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<Login admin={true} />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Protected customer routes */}
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected admin routes */}
          <Route 
            path="/admin/packages" 
            element={
              <ProtectedRoute adminOnly={true}>
                <PackageCatalog />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/orders" 
            element={
              <ProtectedRoute adminOnly={true}>
                <OrderManagement />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;