import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { getAllRequests, approveRequest, rejectRequest } from '../services/api';
import DashboardHeader from '../components/DashboardHeader';
import RequestItem from '../components/RequestItem';
import ValidatorRequestActions from '../components/ValidatorRequestActions';

export default function ValidatorDashboard() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [rejecting, setRejecting] = useState({});

  // Filter requests based on status and search term
  const filteredRequests = requests.filter((r) => {
    const matchesStatus = !status || r.status === status;
    const matchesSearch =
      !debouncedSearchTerm ||
      r.user?.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Fetch requests function
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllRequests(token);
      setRequests(data.requests || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Approve request
  async function handleApprove(requestId) {
    try {
      await approveRequest(requestId, token);
      await fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve request');
    }
  }

  // Reject request
  async function handleReject(requestId) {
    try {
      const comments = rejecting[requestId]?.comments || '';
      await rejectRequest(requestId, comments, token);
      await fetchRequests();
      setRejecting((prev) => {
        const newRejecting = { ...prev };
        delete newRejecting[requestId];
        return newRejecting;
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject request');
    }
  }

  // Handle rejection comments change
  function handleRejectionCommentsChange(requestId, comments) {
    setRejecting((prev) => ({
      ...prev,
      [requestId]: { comments },
    }));
  }

  useEffect(() => {
    if (token) fetchRequests();
  }, [token, fetchRequests]);

  return (
    <div className="validator-dashboard">
      <DashboardHeader title="Validator Dashboard" />
      <div className="validator-filter">
        <div className="form-group">
          <label htmlFor="searchInput">🔍 Search by name</label>
          <input
            id="searchInput"
            type="text"
            className="form-group input"
            placeholder="Enter user name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
            <div
              key={r.id}
              className="request-item-container"
            >
              <RequestItem request={r} />
              {r.status === 'PENDING' && (
                <ValidatorRequestActions
                  requestId={r.id}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  rejectionComments={rejecting[r.id]?.comments}
                  onRejectionCommentsChange={handleRejectionCommentsChange}
                />
              )}
            </div>
          ))}
          {filteredRequests.length === 0 && (
            <div className="info">No requests</div>
          )}
        </div>
      )}
    </div>
  );
}
