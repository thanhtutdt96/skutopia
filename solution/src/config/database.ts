import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const host = process.env.POSTGRES_HOST as string;
const database = process.env.POSTGRES_DATABASE as string;
const user = process.env.POSTGRES_USER as string;
const password = process.env.POSTGRES_PASSWORD as string;
const port = parseInt(process.env.POSTGRES_PORT ?? '5432');

const pool = new Pool({
  host,
  database,
  user,
  password,
  port,
});

export default pool;
