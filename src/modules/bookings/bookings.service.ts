import { dbConfig } from "../../config/dbconfig";

const createBooking = async (payload: Record<string, any>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  // Check if vehicle exists and is available
  const vehicleCheck = await dbConfig.pool.query(
    `SELECT * FROM Vehicles WHERE id = $1`,
    [vehicle_id]
  );

  if (vehicleCheck.rows.length === 0) {
    return { error: "Vehicle not found" };
  }

  const vehicle = vehicleCheck.rows[0];

  if (vehicle.availability_status !== "available") {
    return { error: "Vehicle is not available" };
  }

  // Calculate total price
  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);
  const numberOfDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (numberOfDays <= 0) {
    return { error: "End date must be after start date" };
  }

  const total_price = vehicle.daily_rent_price * numberOfDays;

  // Create booking
  const result = await dbConfig.pool.query(
    `
    INSERT INTO Bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      "active",
    ]
  );

  // Update vehicle status to booked
  await dbConfig.pool.query(
    `UPDATE Vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  const booking = result.rows[0];

  // Fetch vehicle details for response
  const vehicleDetails = await dbConfig.pool.query(
    `SELECT vehicle_name, daily_rent_price FROM Vehicles WHERE id = $1`,
    [vehicle_id]
  );

  return {
    ...booking,
    vehicle: vehicleDetails.rows[0],
  };
};

const getAllBookings = async () => {
  const result = await dbConfig.pool.query(
    `
    SELECT 
      b.id,
      b.customer_id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      u.name as customer_name,
      u.email as customer_email,
      v.vehicle_name,
      v.registration_number
    FROM Bookings b
    JOIN Users u ON b.customer_id = u.id
    JOIN Vehicles v ON b.vehicle_id = v.id
    `
  );

  return result.rows.map((row) => ({
    id: row.id,
    customer_id: row.customer_id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: row.total_price,
    status: row.status,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
    },
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
    },
  }));
};

const getBookingsByCustomerId = async (customerId: number) => {
  const result = await dbConfig.pool.query(
    `
    SELECT 
      b.id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      v.vehicle_name,
      v.registration_number,
      v.type
    FROM Bookings b
    JOIN Vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    `,
    [customerId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: row.total_price,
    status: row.status,
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
      type: row.type,
    },
  }));
};

const updateBookingById = async (
  bookingId: string,
  status: string,
  userRole: string,
  userId: number
) => {
  // Get booking details
  const bookingCheck = await dbConfig.pool.query(
    `SELECT * FROM Bookings WHERE id = $1`,
    [bookingId]
  );

  if (bookingCheck.rows.length === 0) {
    return { error: "Booking not found" };
  }

  const booking = bookingCheck.rows[0];

  // Customer can only cancel their own bookings
  if (userRole === "customer") {
    if (booking.customer_id !== userId) {
      return { error: "You can only cancel your own bookings" };
    }

    if (status !== "cancelled") {
      return { error: "Customers can only cancel bookings" };
    }

    // Check if booking start date is in the future
    const today = new Date();
    const startDate = new Date(booking.rent_start_date);

    if (startDate <= today) {
      return { error: "Cannot cancel booking after start date" };
    }

    // Update booking status to cancelled
    const result = await dbConfig.pool.query(
      `UPDATE Bookings SET status = 'cancelled' WHERE id = $1 RETURNING *`,
      [bookingId]
    );

    // Update vehicle status to available
    await dbConfig.pool.query(
      `UPDATE Vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );

    return result.rows[0];
  }

  // Admin can mark as returned
  if (userRole === "admin") {
    if (status !== "returned") {
      return { error: "Admin can only mark bookings as returned" };
    }

    // Update booking status to returned
    const result = await dbConfig.pool.query(
      `UPDATE Bookings SET status = 'returned' WHERE id = $1 RETURNING *`,
      [bookingId]
    );

    // Update vehicle status to available
    await dbConfig.pool.query(
      `UPDATE Vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );

    // Fetch vehicle details
    const vehicleDetails = await dbConfig.pool.query(
      `SELECT availability_status FROM Vehicles WHERE id = $1`,
      [booking.vehicle_id]
    );

    return {
      ...result.rows[0],
      vehicle: vehicleDetails.rows[0],
    };
  }

  return { error: "Unauthorized action" };
};

export const bookingServices = {
  createBooking,
  getAllBookings,
  getBookingsByCustomerId,
  updateBookingById,
};
