// Custom validators for vacation request endpoints
export function validateSubmitPayload(req, res, next) {
  const { startDate, endDate, reason } = req.body || {};

  if (typeof startDate !== 'string' || typeof endDate !== 'string') {
    return res
      .status(400)
      .json({ success: false, error: 'Start Date and End Date are required' });
  }

  if (
    reason !== undefined &&
    (typeof reason !== 'string' || reason.length > 500)
  ) {
    return res.status(400).json({
      success: false,
      error:
        typeof reason !== 'string'
          ? 'reason must be a string'
          : 'reason too long (max 500 characters)',
    });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return res.status(400).json({ success: false, error: 'Invalid dates' });
  }
  if (end < start) {
    return res.status(400).json({
      success: false,
      error: 'End Date must be after or equal to Start Date',
    });
  }

  next();
}

export function validateRejectPayload(req, res, next) {
  const { comments } = req.body || {};
  if (
    comments !== undefined &&
    (typeof comments !== 'string' || comments.length > 500)
  ) {
    return res.status(400).json({
      success: false,
      error:
        typeof comments !== 'string'
          ? 'comments must be a string'
          : 'comments too long (max 500 characters)',
    });
  }
  next();
}
