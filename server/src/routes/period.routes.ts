import { Router } from 'express';
import { getPeriods, createPeriod, updatePeriodStatus } from '../controllers/period.controller.js';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateJWT, getPeriods);
router.post('/', authenticateJWT, requireRole(['APPRAISER', 'SUPERVISOR']), createPeriod);
router.patch('/:id/status', authenticateJWT, requireRole(['APPRAISER', 'SUPERVISOR']), updatePeriodStatus);

export default router;
