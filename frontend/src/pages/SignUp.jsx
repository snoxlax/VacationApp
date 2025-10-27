import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signUp as apiSignUp } from '../services/api';
import { getErrorMessage } from '../utils/errorHandler';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'REQUESTER',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordMatch, setPasswordMatch] = useState('');

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) setError('');

    // Real-time password validation
    if (name === 'confirmPassword') {
      const password = formData.password;
      const confirmPassword = value;

      if (confirmPassword && password !== confirmPassword) {
        setPasswordMatch('❌ Passwords do not match');
      } else if (confirmPassword && password === confirmPassword) {
        setPasswordMatch('✅ Passwords match');
      } else {
        setPasswordMatch('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword: _, ...userData } = formData;
      const response = await apiSignUp(userData);

      if (response.success && response.token && response.user) {
        signIn(response.user, response.token);
        const role = response.user.role;
        if (role === 'VALIDATOR') {
          navigate('/validator');
        } else {
          navigate('/requester');
        }
      } else {
        setError(response.error || 'Sign up failed');
      }
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <form
        onSubmit={handleSubmit}
        className="signup-form"
      >
        <h2>Sign Up</h2>
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <small
            className="form-help"
            style={{
              color: passwordMatch.includes('❌') ? '#dc3545' : '#28a745',
              fontWeight: '600',
            }}
          >
            {passwordMatch}
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="REQUESTER">Requester</option>
            <option value="VALIDATOR">Validator</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>

        {error && <div className="error">❌ {error}</div>}
      </form>

      <div className="signup-footer">
        <p>Already have an account?</p>
        <Link to="/signin">Sign In</Link>
      </div>
    </div>
  );
}
