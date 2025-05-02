import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import '../../styles/Auth.css';

const Register = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <RegisterForm />
        
        <div className="auth-links">
          <p>
            Already have an account?{' '}
            <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;