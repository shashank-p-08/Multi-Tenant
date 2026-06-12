import express from 'express';
const router = express.Router();
import * as authController from '../controllers/auth.controller.js';
import resolveCompany from '../middleware/companyResolver.js';

router.post('/register', resolveCompany, authController.register);
router.post('/login', resolveCompany, authController.login);

export default router;


