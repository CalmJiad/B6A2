import { Request, Response } from "express";
import { bookingServices } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      req.body;

    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: customer_id, vehicle_id, rent_start_date, rent_end_date",
      });
    }

    const result = await bookingServices.createBooking(req.body);

    if ((result as any).error) {
      return res.status(400).json({
        success: false,
        message: (result as any).error,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.role;
    const userId = req.user?.id;

    let result;

    if (userRole === "admin") {
      result = await bookingServices.getAllBookings();

      if (!result || result.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No bookings found",
          data: [],
        });
      }

      return res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: result,
      });
    } else if (userRole === "customer") {
      result = await bookingServices.getBookingsByCustomerId(userId as number);

      if (!result || result.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No bookings found",
          data: [],
        });
      }

      return res.status(200).json({
        success: true,
        message: "Your bookings retrieved successfully",
        data: result,
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBookingById = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.bookingId;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const userRole = req.user?.role as string;
    const userId = req.user?.id as number;

    const result = await bookingServices.updateBookingById(
      bookingId,
      status,
      userRole,
      userId
    );

    if ((result as any).error) {
      return res.status(400).json({
        success: false,
        message: (result as any).error,
      });
    }

    // Different messages based on status
    let message = "Booking updated successfully";
    if (status === "cancelled") {
      message = "Booking cancelled successfully";
    } else if (status === "returned") {
      message = "Booking marked as returned. Vehicle is now available";
    }

    return res.status(200).json({
      success: true,
      message: message,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getAllBookings,
  updateBookingById,
};
