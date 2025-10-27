export default function RequestItem({ request }) {
  return (
    <div className="request-item">
      <div className="request-header">
        <div className="request-user">
          <strong className="user-name-text">
            {request.user?.name || 'User'}
          </strong>
        </div>
        <div
          className={`request-status-badge status-${request.status.toLowerCase()}`}
        >
          {request.status}
        </div>
      </div>

      <div className="request-info-compact">
        <div className="request-dates">
          <span className="date-icon">📅</span>
          <span className="date-range">
            {new Date(request.startDate).toLocaleDateString()}
            {' → '}
            {new Date(request.endDate).toLocaleDateString()}
          </span>
        </div>

        {request.reason && (
          <div className="request-reason">
            <div className="reason-label">
              <span className="reason-icon">💬</span>
              Reason:
            </div>
            <div className="reason-content">"{request.reason}"</div>
          </div>
        )}
      </div>

      {request.comments && (
        <div className="request-comments">
          <div className="comments-label">
            <span className="comments-icon">📝</span>
            Comments:
          </div>
          <div className="comments-content">"{request.comments}"</div>
        </div>
      )}
    </div>
  );
}
