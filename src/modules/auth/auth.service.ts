import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
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

const loginUser = async (email: string, password: string) => {
  const result = await dbConfig.pool.query(
    `SELECT * FROM Users WHERE email=$1`,
    [email]
  );

  if (result.rows.length === 0) return null;

  const user = result.rows[0];

  const userInfos = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  const passwordMatched = await bcrypt.compare(password, user.password);

  if (!passwordMatched) return false;

  // to generate a secure secret
  // in node terminal: {node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"}
  // using linux: {openssl rand -hex 64}

  const token = jwt.sign(
    { name: userInfos.name, email: userInfos.email, role: userInfos.role },
    `${config.jwt_secret}`,
    { expiresIn: "1d" }
  );
  return { token, userInfos };
};

export const authServices = {
  createUser,
  loginUser,
};
