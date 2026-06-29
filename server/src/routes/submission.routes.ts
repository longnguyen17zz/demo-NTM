import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { 
  getSubmissions, 
  getSubmissionById, 
  saveSubmission, 
  appraiseSubmission, 
  superviseSubmission, 
  addProofFile,
  getTemplates,
  getTemplateByCode,
  saveTemplate,
  deleteTemplate
} from '../controllers/submission.controller.js';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware.js';

// Setup file upload folder
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const router = Router();

// Template routes
router.get('/templates', authenticateJWT, getTemplates);
router.get('/templates/:code', authenticateJWT, getTemplateByCode);
router.post('/templates', authenticateJWT, saveTemplate);
router.delete('/templates/:code', authenticateJWT, deleteTemplate);

// Submission routes
router.get('/', authenticateJWT, getSubmissions);
router.get('/:id', authenticateJWT, getSubmissionById);
router.post('/', authenticateJWT, saveSubmission);
router.post('/:id/appraise', authenticateJWT, requireRole(['APPRAISER']), appraiseSubmission);
router.post('/:id/supervise', authenticateJWT, requireRole(['SUPERVISOR']), superviseSubmission);
router.post('/:id/proofs', authenticateJWT, upload.single('file'), addProofFile);

export default router;
