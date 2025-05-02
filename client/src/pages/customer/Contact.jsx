import React, { useState } from 'react';
import { submitContactForm } from '../../services/contactService';
import '../../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { name, email, message } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await submitContactForm(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-info">
          <h1>Contact Us</h1>
          <p>
            Have questions about our furniture packages or need assistance with your order?
            Fill out the form and we'll get back to you as soon as possible.
          </p>
          
          <div className="contact-details">
            <div className="contact-item">
              <i className="icon-location"></i>
              <span>123 Furniture St, Design District, City</span>
            </div>
            <div className="contact-item">
              <i className="icon-phone"></i>
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="contact-item">
              <i className="icon-email"></i>
              <span>info@furniturecalculator.com</span>
            </div>
            <div className="contact-item">
              <i className="icon-hours"></i>
              <span>Mon-Fri: 9am - 6pm, Sat: 10am - 4pm</span>
            </div>
          </div>
        </div>
        
        <div className="contact-form-container">
          {success ? (
            <div className="success-message">
              <h2>Thank You!</h2>
              <p>Your message has been sent successfully. We'll get back to you soon.</p>
              <button onClick={() => setSuccess(false)} className="new-message-btn">
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={handleChange}
                  rows="5"
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="send-btn" 
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;