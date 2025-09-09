import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    studentId: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    // Basic validation for step 1
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Additional validation for step 2
    if (!formData.university || !formData.studentId) {
      setError('Please fill in all university information');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, you would send this data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll create a mock user
      const newUser = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name,
        email: formData.email,
        isStudent: true,
        university: formData.university,
        studentId: formData.studentId,
        phone: formData.phone || null,
        joinDate: new Date().toISOString()
      };
      
      register(newUser);
      navigate('/verification'); // In a real app, you would redirect to a verification page
    } catch (err) {
      setError(err.message || 'Failed to create an account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const universities = [
    'Select your university',
    'Demo University',
    'Tech Institute',
    'State College',
    'Metropolitan University',
    'Other (please specify)'
  ];

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Your Account</h2>
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Account</div>
          </div>
          <div className={`step-connector ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">University</div>
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {step === 1 ? (
          <form onSubmit={handleNext} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name <span className="required">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">University Email <span className="required">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@university.edu"
              />
              <small className="hint">Use your university email for verification</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password <span className="required">*</span></label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a strong password"
              />
              <small className="hint">At least 6 characters</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
            </div>
            
            <div className="form-footer">
              <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
              >
                Next: University Info
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="university">University <span className="required">*</span></label>
              <select
                id="university"
                name="university"
                value={formData.university}
                onChange={handleChange}
                required
              >
                {universities.map((uni, index) => (
                  <option key={index} value={uni} disabled={index === 0}>
                    {uni}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="studentId">Student ID <span className="required">*</span></label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                placeholder="Enter your student ID"
              />
              <small className="hint">For verification purposes only</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(123) 456-7890"
              />
              <small className="hint">Optional - for order updates</small>
            </div>
            
            <div className="form-footer">
              <button 
                type="button" 
                className="auth-button secondary"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back
              </button>
              <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        )}
        
        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Login</Link>
        </div>
        
        <div className="terms">
          By signing up, you agree to our <Link to="/terms">Terms of Service</Link> and{' '}
          <Link to="/privacy">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
};

export default Register;
