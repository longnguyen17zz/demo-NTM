import { Router } from 'express';
import { getUnits, updateUnitStatus, saveUnit, deleteUnit, importUnitsBatch } from '../controllers/unit.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateJWT, getUnits);
router.put('/:code', authenticateJWT, updateUnitStatus);
router.post('/', authenticateJWT, saveUnit);
router.post('/batch', authenticateJWT, importUnitsBatch);
router.delete('/:code', authenticateJWT, deleteUnit);

export default router;
