import { dbConfig } from "../../config/dbconfig";

const createVehicle = async (payload: Record<string, unknown>) => {
  console.log(payload);
  let {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await dbConfig.pool.query(
    `
    INSERT INTO Vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result.rows[0];
};

const getAllVehicle = async () => {
  const result = await dbConfig.pool.query(`SELECT * FROM Vehicles`);
  return result.rows;
};

const getVehicleById = async (vehicleId: string) => {
  const result = await dbConfig.pool.query(
    `
    SELECT * FROM Vehicles WHERE id = $1
    `,
    [vehicleId]
  );
  return result.rows;
};

const updateVehicleById = async (
  vehicleId: string,
  payload: Record<string, unknown>
) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await dbConfig.pool.query(
    `
    UPDATE Vehicles
    SET
      vehicle_name        = COALESCE($1, vehicle_name),
      type                = COALESCE($2, type),
      registration_number = COALESCE($3, registration_number),
      daily_rent_price    = COALESCE($4, daily_rent_price),
      availability_status = COALESCE($5, availability_status)
    WHERE id = $6
    RETURNING 
      id, 
      vehicle_name, 
      type, 
      registration_number, 
      daily_rent_price, 
      availability_status;
    `,
    [
      vehicle_name ?? null,
      type ?? null,
      registration_number ?? null,
      daily_rent_price ?? null,
      availability_status ?? null,
      vehicleId,
    ]
  );

  return result || null;
};

export const vehicleServices = {
  createVehicle,
  getAllVehicle,
  getVehicleById,
  updateVehicleById,
};
