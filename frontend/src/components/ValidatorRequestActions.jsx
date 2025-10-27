export default function ValidatorRequestActions({
  requestId,
  onApprove,
  onReject,
  rejectionComments,
  onRejectionCommentsChange,
}) {
  return (
    <div
      className="request-actions"
      style={{ width: '100%' }}
    >
      <div className="action-section approve-section">
        <div className="action-header">
          <span className="action-icon">✓</span>
          <span className="action-title">Approve Request</span>
        </div>
        <button
          className="btn-approve"
          onClick={() => onApprove(requestId)}
        >
          <span className="btn-icon">✓</span>
          Approve
        </button>
      </div>

      <div className="action-section reject-section">
        <div className="action-header">
          <span className="action-icon">✕</span>
          <span className="action-title">Reject Request</span>
        </div>
        <div className="manager-note-section">
          <div className="manager-note-label">
            <span className="note-icon">📝</span>
            Manager Note (Optional):
          </div>
          <textarea
            className="form-group textarea"
            placeholder="Add a reason for rejection..."
            value={rejectionComments || ''}
            onChange={(e) =>
              onRejectionCommentsChange(requestId, e.target.value)
            }
          />
        </div>
        <button
          className="btn-reject"
          onClick={() => onReject(requestId)}
        >
          <span className="btn-icon">✕</span>
          Reject
        </button>
      </div>
    </div>
  );
}
