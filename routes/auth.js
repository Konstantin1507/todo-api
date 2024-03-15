import express from 'express';

import errorHandler from '../middleware/errorHandler.js';
import { signup, login } from '../controllers/auth.js';

const router = express.Router();

router.post('/signup', errorHandler(signup));

router.post('/login', errorHandler(login));

export default router;
