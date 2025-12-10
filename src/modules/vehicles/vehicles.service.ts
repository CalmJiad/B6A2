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

export const vehicleServices = {
  createVehicle,
};
