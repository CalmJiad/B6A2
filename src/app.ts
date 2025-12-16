import express, { Request, Response } from "express";
import { dbConfig } from "./config/dbconfig";
import { authRoutes } from "./modules/auth/auth.routes";
import { bookingRoutes } from "./modules/bookings/bookings.routes";
import { userRoutes } from "./modules/user/user.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicles.routes";

const app = express();

// express middlewares
app.use(express.json());

// intialise db
dbConfig.initDB();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Vehicle management system",
  });
});

// modular routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", vehicleRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", bookingRoutes);

// not found route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "No Such Route Found",
    path: req.path,
  });
});

// global error handler
app.use((error: any, req: Request, res: Response, next: any) => {
  console.error("Error:", error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
});

export default app;
