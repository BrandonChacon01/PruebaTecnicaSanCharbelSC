import mysql from "mysql2/promise";
import { DB_DATABASE, DB_PASSWORD, DB_SERVER, DB_USER } from "../config/config.js";

export const dbSettings = {
  host: DB_SERVER,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
};

export const getConnection = async () => {
  try {
    const connection = await mysql.createConnection(dbSettings);
    return connection;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { mysql };