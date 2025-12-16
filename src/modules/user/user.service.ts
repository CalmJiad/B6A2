import { dbConfig } from "../../config/dbconfig";

const getAllUsers = async () => {
  const result = await dbConfig.pool.query(`
    SELECT id, name, email, phone, role, created_at, updated_at 
    FROM Users
  `);

  return result.rows;
};

const updateUserByCustomer = async (
  userId: string,
  updatesPayload: Record<string, any>
) => {
  let { name, email, phone } = updatesPayload;

  // normalize email if provided
  if (email !== undefined && typeof email === "string") {
    email = email.toLowerCase();
  }

  // If nothing to update, return null (controller can send 400 if it wants)
  if (name === undefined && email === undefined && phone === undefined) {
    return null;
  }

  const result = await dbConfig.pool.query(
    `
    UPDATE Users
    SET
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      phone = COALESCE($3, phone),
      updated_at = NOW()
    WHERE id = $4
    RETURNING id, name, email, phone, role
    `,
    [name ?? null, email ?? null, phone ?? null, userId]
  );

  return result.rows[0] || null;
};

const updateUserByAdmin = async (
  userId: string,
  updatesPayload: Record<string, any>
) => {
  let { name, email, phone, role } = updatesPayload;

  if (email !== undefined && typeof email === "string") {
    email = email.toLowerCase();
  }

  if (
    name === undefined &&
    email === undefined &&
    phone === undefined &&
    role === undefined
  ) {
    return null;
  }

  const result = await dbConfig.pool.query(
    `
    UPDATE Users
    SET
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      phone = COALESCE($3, phone),
      role = COALESCE($4, role),
      updated_at = NOW()
    WHERE id = $5
    RETURNING id, name, email, phone, role
    `,
    [name ?? null, email ?? null, phone ?? null, role ?? null, userId]
  );

  return result.rows[0] || null;
};

const deleteUserById = async (userId: string) => {
  // Check if user has any active bookings
  const activeBookings = await dbConfig.pool.query(
    `
    SELECT * FROM Bookings 
    WHERE customer_id = $1 AND status = 'active'
    `,
    [userId]
  );

  if (activeBookings.rows.length > 0) {
    return { error: "Cannot delete user with active bookings" };
  }

  const result = await dbConfig.pool.query(
    `
    DELETE FROM Users WHERE id = $1 RETURNING *
    `,
    [userId]
  );

  return result.rows[0] || null;
};

export const userServices = {
  getAllUsers,
  updateUserByCustomer,
  updateUserByAdmin,
  deleteUserById,
};
