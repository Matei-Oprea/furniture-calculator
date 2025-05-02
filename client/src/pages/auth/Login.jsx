import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import '../../styles/Auth.css';

const Login = ({ admin = false }) => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <LoginForm admin={admin} />
        
        {!admin && (
          <div className="auth-links">
            <p>
              Don't have an account?{' '}
              <Link to="/register">Register here</Link>
            </p>
          </div>
        )}
        
        {admin && (
          <div className="auth-links">
            <p>
              <Link to="/login">Customer login</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;