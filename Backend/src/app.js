import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import companyRoutes from './routes/company.routes.js';
import tenantRoutes from './routes/tenant.routes.js';
import resolveCompany from './middleware/companyResolver.js';

const app = express();


app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes for companies (Common DB)
app.use('/api/companies', companyRoutes);

// Tenant-specific routes
app.use('/api/tenant-data', tenantRoutes);

// Tenant-specific routes example
app.use('/api/tenant', resolveCompany, (req, res) => {
  res.json({ message: `Accessing data for tenant ${req.tenantInfo.tenant_name}` });
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
