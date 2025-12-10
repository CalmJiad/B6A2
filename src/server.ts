import express, { Request, Response } from "express";
import config from "./config";
import { dbConfig } from "./config/dbconfig";

const app = express();

// express middlewares
app.use(express.json());

// intialise db
dbConfig.initDB();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "You are good to go",
  });
});

app.listen(config.port, () => {
  console.log(`Server Is Running On Port ${config.port}`);
});
