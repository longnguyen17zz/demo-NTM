import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCriteria,
  createCriterion,
  updateCriterion,
  deleteCriterion
} from '../controllers/criteria.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Category routes
router.get('/categories', authenticateJWT, getCategories);
router.post('/categories', authenticateJWT, createCategory);
router.put('/categories/:oldName', authenticateJWT, updateCategory);
router.delete('/categories/:name', authenticateJWT, deleteCategory);

// Criteria routes
router.get('/', authenticateJWT, getCriteria);
router.post('/', authenticateJWT, createCriterion);
router.put('/:id', authenticateJWT, updateCriterion);
router.delete('/:id', authenticateJWT, deleteCriterion);

export default router;
