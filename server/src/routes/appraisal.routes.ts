import { Router } from 'express';
import { getAppraisals, getAppraisalById, createAppraisal, updateAppraisal } from '../controllers/appraisal.controller.js';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateJWT, getAppraisals);
router.get('/:id', authenticateJWT, getAppraisalById);
router.post('/', authenticateJWT, requireRole(['APPRAISER', 'SUPERVISOR']), createAppraisal);
router.put('/:id', authenticateJWT, requireRole(['APPRAISER', 'SUPERVISOR']), updateAppraisal);

export default router;
