import { Router } from 'express';
import authRoutes from './auth.routes.js';
import unitRoutes from './unit.routes.js';
import periodRoutes from './period.routes.js';
import submissionRoutes from './submission.routes.js';
import appraisalRoutes from './appraisal.routes.js';
import indicatorRoutes from './indicator.routes.js';
import criteriaRoutes from './criteria.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/units', unitRoutes);
router.use('/periods', periodRoutes);
router.use('/submissions', submissionRoutes);
router.use('/appraisals', appraisalRoutes);
router.use('/indicators', indicatorRoutes);
router.use('/criteria', criteriaRoutes);

export default router;
