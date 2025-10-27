import { useState } from 'react';
import { createRequest } from '../services/api';
import { getErrorMessage } from '../utils/errorHandler';
import { validateVacationRequest } from '../utils/validation';

export default function RequestForm({ onRequestSubmitted, token }) {
  const [form, setForm] = useState({ startDate: '', endDate: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validate form before submitting
    const validation = validateVacationRequest(form);
    if (!validation.isValid) {
      setError(validation.errors);
      setLoading(false);
      return;
    }

    try {
      const res = await createRequest(
        {
          startDate: form.startDate,
          endDate: form.endDate,
          reason: form.reason.trim() || undefined,
        },
        token
      );
      if (res.success) {
        setMessage('Request submitted');
        setForm({ startDate: '', endDate: '', reason: '' });
        // Notify parent to refresh requests list
        if (onRequestSubmitted) onRequestSubmitted();
      } else {
        setError(res.error || 'Failed to submit');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="request-form-container">
      <h3>Submit Vacation Request</h3>
      <form
        onSubmit={handleSubmit}
        className="request-form"
      >
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reason">
            Reason (optional)
            {form.reason && (
              <span
                className={`char-count ${
                  form.reason.length > 500 ? 'error' : ''
                }`}
              >
                {form.reason.length}/500
              </span>
            )}
          </label>
          <textarea
            id="reason"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            disabled={loading}
            maxLength={500}
            placeholder="Enter reason for vacation request..."
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
      <div className="request-form-output">
        {message && <div className="success">✅ {message}</div>}
        {error && <div className="error">❌ {error}</div>}
      </div>
    </div>
  );
}
