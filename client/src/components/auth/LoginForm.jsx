import React, { useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/Auth.css';

const LoginForm = ({ admin = false }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  }, [error]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { email, password } = formData;

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await loginUser(email, password, admin);

      if (!result.success) {
        setError(result.message || 'Login failed');
        return;
      }

      // Navigation based on role
      if (admin) {
        if (result.user.role === 'admin') {
          navigate('/admin/packages');
        } else {
          setError('Access denied. Admin privileges required.');
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, loginUser, admin, navigate]);

  return (
    <div className="auth-form-container">
      <h2>{admin ? 'Admin Login' : 'Login'}</h2>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && (
          <div
            className="error-message"
            role="alert"
            style={{
              padding: '12px',
              marginBottom: '20px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '4px',
              color: '#c00'
            }}
          >
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={isSubmitting}
          style={{
            backgroundColor: isSubmitting ? '#ccc' : '#007bff',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1
          }}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;