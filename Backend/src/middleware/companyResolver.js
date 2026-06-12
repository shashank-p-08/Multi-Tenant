import * as commonDb from '../config/commonDb.js';
import tenantDb from '../config/tenantDb.js';
const { getTenantPool } = tenantDb;

const resolveCompany = async (req, res, next) => {

  const slug = (req.query.company || req.headers['x-company-slug'])?.trim();
  console.log(`[CompanyResolver] Resolving company for slug: "${slug}"`);

  if (!slug || slug === 'null' || slug === 'undefined') {
    return res.status(400).json({ error: 'Valid company slug is required' });
  }

  try {
    // Fetch tenant configuration from common Database
    const result = await commonDb.query(
      'SELECT tenant_id, tenant_name, slug, connection_uri FROM tenants WHERE slug = $1',
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const tenantInfo = result.rows[0];
    console.log(`[CompanyResolver] Found Tenant: ID=${tenantInfo.tenant_id}, Name="${tenantInfo.tenant_name}"`);
    console.log(`[CompanyResolver] Connection String: ${tenantInfo.connection_uri}`);

    console.log(`[DatabaseSwitch] >>> Switching request context to Tenant DB: ${tenantInfo.slug} <<<`);
    req.tenantDb = getTenantPool(tenantInfo.connection_uri);
    req.tenantInfo = tenantInfo;

    next();
  } catch (error) {
    console.error('Error resolving tenant:', error);
    res.status(500).json({ error: 'Internal server error resolving tenant' });
  }
};


export default resolveCompany;

