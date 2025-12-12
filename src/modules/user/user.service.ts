import { dbConfig } from "../../config/dbconfig";

const getAllUsers = async () => {
  const result = await dbConfig.pool.query(`
    SELECT id, name, email, phone, role, created_at, updated_at 
    FROM Users
  `);

  return result.rows;
};

export const userServices = {
  getAllUsers,
};
