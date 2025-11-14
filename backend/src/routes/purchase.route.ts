import express from 'express';
import { createPurchase } from '../controllers/purchase.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/',authenticateToken, createPurchase);

export default router;