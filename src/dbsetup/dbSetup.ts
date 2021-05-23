import { Pool } from 'pg';

const pool = new Pool({
  max: 20,
  connectionString:
    'postgres://postgres:ritwiksinha@localhost:5432/libraryAssignment',
  idleTimeoutMillis: 3000
});

export default pool;
