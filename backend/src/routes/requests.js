import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import {
  validateSubmitPayload,
  validateRejectPayload,
} from '../middleware/validation.js';
import {
  submitRequest,
  listMyRequests,
  listAllRequests,
  approveRequest,
  rejectRequest,
} from '../controllers/vacationRequestController.js';

const router = express.Router();

// Requester endpoints
router.post(
  '/',
  authMiddleware,
  requireRole(['REQUESTER']),
  validateSubmitPayload,
  submitRequest
);

router.get(
  '/my-requests',
  authMiddleware,
  requireRole(['REQUESTER']),
  listMyRequests
);

// Validator endpoints
router.get(
  '/all-requests',
  authMiddleware,
  requireRole(['VALIDATOR']),
  listAllRequests
);

router.put(
  '/:id/approve',
  authMiddleware,
  requireRole(['VALIDATOR']),
  approveRequest
);

router.put(
  '/:id/reject',
  authMiddleware,
  requireRole(['VALIDATOR']),
  validateRejectPayload,
  rejectRequest
);

export default router;
