import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, {
  schema
});

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export default db;
