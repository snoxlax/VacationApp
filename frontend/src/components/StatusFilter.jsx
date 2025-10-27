export default function StatusFilter({ status, onStatusChange }) {
  return (
    <div className="validator-filter">
      <div className="form-group">
        <label htmlFor="statusFilter">Filter by status</label>
        <select
          id="statusFilter"
          className="form-group select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>
    </div>
  );
}
