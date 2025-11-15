import express from 'express';
import { registerHandler, loginHandler, logoutHandler, refreshAccessToken } from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', registerHandler);
router.post("/login", loginHandler);
router.post("/", logoutHandler);
router.post("/refresh", refreshAccessToken); 

export default router;