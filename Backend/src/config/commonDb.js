import pg from 'pg';
const { Pool } = pg;
import 'dotenv/config';

const commonPool = new Pool({
  connectionString: process.env.MASTER_DB_URI,
});

commonPool.on('connect', () => {
  console.log('Master Database connected successfully');
});

commonPool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = (text, params) => commonPool.query(text, params);
export const pool = commonPool;

