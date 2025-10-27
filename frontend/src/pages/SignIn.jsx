import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signIn as apiSignIn } from '../services/api';
import { getErrorMessage } from '../utils/errorHandler';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiSignIn(formData);

      if (response.success && response.token && response.user) {
        signIn(response.user, response.token);
        navigate(
          response.user.role === 'VALIDATOR' ? '/validator' : '/requester'
        );
      } else {
        setError(response.error || 'Sign in failed');
      }
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <form
        onSubmit={handleSubmit}
        className="signin-form"
      >
        <h2>Sign In</h2>
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

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        {error && <div className="error">❌ {error}</div>}
      </form>

      <div className="signin-footer">
        <p>Don't have an account?</p>
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}
