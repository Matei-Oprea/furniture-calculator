import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/Navbar.css';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Furniture Calculator
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          {isAuthenticated && !isAdmin && (
            <li className="nav-item">
              <Link to="/orders" className="nav-link">
                My Orders
              </Link>
            </li>
          )}
          {isAdmin && (
            <>
              <li className="nav-item">
                <Link to="/admin/packages" className="nav-link">
                  Manage Packages
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/orders" className="nav-link">
                  Manage Orders
                </Link>
              </li>
            </>
          )}
          <li className="nav-item">
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </li>
        </ul>
        <div className="nav-auth">
          {isAuthenticated ? (
            <>
              <span className="user-welcome">Welcome, {user?.name}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">
                Login
              </Link>
              <Link to="/register" className="btn-register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;