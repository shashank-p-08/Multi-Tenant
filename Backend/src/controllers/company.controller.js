import * as commonDb from '../config/commonDb.js';

export const getAllCompanies = async (req, res) => {

  try {
    const result = await commonDb.query('SELECT tenant_id, tenant_name, slug FROM tenants');
    res.json(result.rows);
  } catch (error) {
    console.error('Get all tenants error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getCompanyById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await commonDb.query('SELECT id, name, domain FROM companies WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
