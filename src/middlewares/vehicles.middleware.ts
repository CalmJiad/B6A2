import { NextFunction, Request, Response } from "express";

const createVehicleValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if body is missing
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Request body is missing or empty. Please send valid JSON data.",
    });
  }

  // Safe destructuring
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body || {};

  // Required fields
  if (
    !vehicle_name ||
    !type ||
    !registration_number ||
    daily_rent_price == null
  ) {
    return res.status(400).json({
      success: false,
      message:
        "All fields are required: vehicle_name, type, registration_number, daily_rent_price",
    });
  }

  // vehicle_name validation
  if (typeof vehicle_name !== "string" || vehicle_name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "vehicle_name must be a non-empty string",
    });
  }

  // registration_number validation
  if (
    typeof registration_number !== "string" ||
    registration_number.trim().length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "registration_number must be a non-empty string",
    });
  }

  // type validation
  const validTypes = ["car", "bike", "van", "SUV"];
  if (typeof type !== "string" || !validTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: "type must be one of: 'car', 'bike', 'van', 'SUV'",
    });
  }

  // daily_rent_price validation
  if (typeof daily_rent_price !== "number" || daily_rent_price <= 0) {
    return res.status(400).json({
      success: false,
      message: "daily_rent_price must be a positive number",
    });
  }

  // availability_status validation
  const validStatuses = ["available", "booked"];
  if (
    availability_status &&
    (typeof availability_status !== "string" ||
      !validStatuses.includes(availability_status))
  ) {
    return res.status(400).json({
      success: false,
      message: "availability_status must be either 'available' or 'booked'",
    });
  }

  // Optional default
  if (!availability_status) req.body.availability_status = "available";

  next();
};

export const vehicleMiddlewares = {
  createVehicleValidator,
};
