import express from 'express';
const router = express.Router();
import * as companyController from '../controllers/company.controller.js';
import authenticate from '../middleware/authMiddleware.js';

router.get('/', companyController.getAllCompanies);
router.get('/:id', authenticate, companyController.getCompanyById);

export default router;

