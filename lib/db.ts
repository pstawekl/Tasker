import { Pool, PoolConfig, QueryResult } from 'pg';

const config: PoolConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  ssl: false
};

const pool = new Pool(config);

export async function executeQuery(query: string, params?: any[]): Promise<QueryResult<any>> {
  try {
    const db = await pool.connect();
    const result: QueryResult<any> = await db.query(query, params);
    db.release();
    return result;
  } catch (error) {
    console.error('Błąd zapytania do bazy danych:', error);
    throw error;
  }
}

export default pool;
