import { Router } from "express";
import { authMiddlewares } from "../../middlewares/auth.middleware";
import { bookingControllers } from "./bookings.controller";

const router = Router();

router.post(
  "/bookings",
  authMiddlewares.tokenAuthorizer("admin", "customer"),
  bookingControllers.createBooking
);

router.get(
  "/bookings",
  authMiddlewares.tokenAuthorizer("admin", "customer"),
  bookingControllers.getAllBookings
);

router.put(
  "/bookings/:bookingId",
  authMiddlewares.tokenAuthorizer("admin", "customer"),
  bookingControllers.updateBookingById
);

export const bookingRoutes = router;
