import { Request, Response } from "express";
import { CreateUserPayload } from "../../types/auth.types";
import { authServices } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.createUser(req.body as CreateUserPayload);
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: true,
      error: error.message,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  let { email, password } = req.body;
  email = email.toLowerCase();
  try {
    const result = await authServices.loginUser(email, password);
    if (result === null) {
      return res.status(400).json({
        success: false,
        message: "User email does not exists",
      });
    }
    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Password did not match",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: true,
      error: error.message,
    });
  }
};

export const authControllers = {
  createUser,
  loginUser,
};
