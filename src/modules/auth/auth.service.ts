import bcrypt from "bcryptjs";
import { dbConfig } from "../../config/dbconfig";
import { CreateUserPayload } from "../../types/auth.types";

const createUser = async (payload: CreateUserPayload) => {
  let { name, email, password, phone, role } = payload;

  email = (email as string).toLowerCase();

  // check if there is any user with previous email
  const existingUser = await dbConfig.pool.query(
    "SELECT * FROM Users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    return false;
  }

  // password hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  // setting up default role if the role seems undefined
  const finalRole = role ?? "customer";

  const result = await dbConfig.pool.query(
    `INSERT INTO Users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING * `,
    [name, email, hashedPassword, phone, finalRole]
  );
  return result.rows[0];
};

export const authServices = {
  createUser,
};
