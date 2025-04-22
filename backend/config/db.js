import { neon } from "@neondatabase/serverless";

import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

//create a sql connection using our env variables
export const sql = neon(
    `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`,
)

// this sql function is used as a tagged template literal, which allows us to write SQL queries in a more readable way.
