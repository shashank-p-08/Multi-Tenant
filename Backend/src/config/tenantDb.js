import pg from 'pg';
const { Pool } = pg;

const tenantPools = {};

export const getTenantPool = (connectionString) => {

  if (tenantPools[connectionString]) {
    console.log(`[TenantDB] Reusing existing connection pool for: ${connectionString.split('@').pop()}`);
    return tenantPools[connectionString];
  }

  console.log(`[TenantDB] Creating NEW connection pool for: ${connectionString.split('@').pop()}`);
  const pool = new Pool({
    connectionString: connectionString,
  });

  pool.on('connect', () => {
    console.log(`[TenantDB] Connected to tenant database: ${connectionString.split('/').pop()}`);
  });

  tenantPools[connectionString] = pool;
  return pool;
};

export default {
  getTenantPool,
};


