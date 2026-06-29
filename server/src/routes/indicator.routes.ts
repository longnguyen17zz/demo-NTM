import { Router } from 'express';
import { getIndicatorsDictionary, getIndicatorValues, saveIndicatorValue } from '../controllers/indicator.controller.js';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/dictionary', authenticateJWT, getIndicatorsDictionary);
router.get('/values', authenticateJWT, getIndicatorValues);
router.post('/values', authenticateJWT, requireRole(['APPRAISER', 'SUPERVISOR']), saveIndicatorValue);

export default router;
