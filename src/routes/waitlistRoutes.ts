import express from 'express';
import { joinWaitlist } from '../controllers/waitlistControllers';

const router = express.Router();

// POST /api/waitlist
router.post('/', joinWaitlist);

export default router;