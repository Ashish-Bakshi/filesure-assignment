import express from 'express';
import { createPurchase } from '../controllers/purchase.controller';

const router = express.Router();

router.post('/purchases', createPurchase);

export default router;