import {
  createVacationRequest,
  getMyVacationRequests,
  getAllVacationRequests,
  approveVacationRequest,
  rejectVacationRequest,
  getVacationRequestById,
} from '../models/vacationRequestModel.js';

export async function submitRequest(req, res) {
  const { startDate, endDate, reason } = req.body;
  const userId = req.user.id;

  const request = await createVacationRequest({
    userId,
    startDate,
    endDate,
    reason,
  });
  res.status(201).json({ success: true, request });
}

export async function listMyRequests(req, res) {
  const userId = req.user.id;
  const requests = await getMyVacationRequests(userId);
  res.json({ success: true, requests });
}

export async function listAllRequests(req, res) {
  const { status } = req.query;
  const allowed = [undefined, 'PENDING', 'APPROVED', 'REJECTED'];
  if (!allowed.includes(status)) {
    return res
      .status(400)
      .json({ success: false, error: 'Invalid status filter' });
  }
  const requests = await getAllVacationRequests(status);
  res.json({ success: true, requests });
}

export async function approveRequest(req, res) {
  const { id } = req.params;
  const existing = await getVacationRequestById(id);
  if (!existing)
    return res.status(404).json({ success: false, error: 'Request not found' });
  if (existing.status !== 'PENDING')
    return res
      .status(400)
      .json({ success: false, error: 'Only pending requests can be approved' });
  const updated = await approveVacationRequest(id);
  res.json({ success: true, request: updated });
}

export async function rejectRequest(req, res) {
  const { id } = req.params;
  const { comments } = req.body;
  const existing = await getVacationRequestById(id);
  if (!existing)
    return res.status(404).json({ success: false, error: 'Request not found' });
  if (existing.status !== 'PENDING')
    return res
      .status(400)
      .json({ success: false, error: 'Only pending requests can be rejected' });
  const updated = await rejectVacationRequest(id, comments);
  res.json({ success: true, request: updated });
}
