import express from 'express';
const router = express.Router();
import * as tenantController from '../controllers/tenant.controller.js';
import resolveCompany from '../middleware/companyResolver.js';
import authenticate from '../middleware/authMiddleware.js';

router.get('/top-customers', resolveCompany, authenticate, tenantController.getTopCustomers);
router.get('/top-products', resolveCompany, authenticate, tenantController.getTopProducts);

export default router;
