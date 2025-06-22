import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './userSlice';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    referralCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError(null);
    setIsLoading(true);
    
    // Basic client-side validation
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required');
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        'https://multi-level-referral-and-earning-system-geln.onrender.com/api/auth/register',
        form
      );
      
      if (res.data.user) {
        dispatch(loginSuccess(res.data.user));
        navigate('/dashboard');
      } else {
        throw new Error('User data missing in response');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Registration failed';
      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <input
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="referralCode"
        placeholder="Referral Code (optional)"
        value={form.referralCode}
        onChange={handleChange}
      />
      
      <button 
        onClick={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? 'Registering...' : 'Register'}
      </button>
      
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
}
