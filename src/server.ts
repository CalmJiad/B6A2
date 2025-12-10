import express, { Request, Response } from "express";
import config from "./config";
import { dbConfig } from "./config/dbconfig";
import { authRoutes } from "./modules/auth/auth.routes";

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

// not found route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "No Such Route Found",
    path: req.path,
  });
});

app.listen(config.port, () => {
  console.log(`Server Is Running On Port ${config.port}`);
});
