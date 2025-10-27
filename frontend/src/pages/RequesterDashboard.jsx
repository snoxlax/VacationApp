import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMyRequests } from '../services/api';
import DashboardHeader from '../components/DashboardHeader';
import RequestForm from '../components/RequestForm';
import RequestItem from '../components/RequestItem';

export default function RequesterDashboard() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');

  // Filter requests based on status
  const filteredRequests = status
    ? requests.filter((r) => r.status === status)
    : requests;

  // Fetch requests function
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyRequests(token);
      if (data.success) {
        setRequests(data.requests || []);
      } else {
        setError(data.error || 'Failed to fetch requests');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Handle request submitted from form
  function handleRequestSubmitted() {
    fetchRequests();
  }

  useEffect(() => {
    if (token) fetchRequests();
  }, [token, fetchRequests]);

  return (
    <div className="requester-dashboard">
      <DashboardHeader title="Requester Dashboard" />
      <RequestForm
        onRequestSubmitted={handleRequestSubmitted}
        token={token}
      />

      <div className="requester-filter">
        <div className="form-group">
          <label htmlFor="statusFilter">Filter by status</label>
          <select
            id="statusFilter"
            className="form-group select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {loading && <div className="info">Loading...</div>}
      {error && <div className="error">❌ {error}</div>}
      {!loading && !error && (
        <div className="requests-list">
          {filteredRequests.map((r) => (
            <RequestItem
              key={r.id}
              request={r}
            />
          ))}
          {filteredRequests.length === 0 && (
            <div className="info">No requests yet</div>
          )}
        </div>
      )}
    </div>
  );
}
