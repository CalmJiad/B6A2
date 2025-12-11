import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const signupValidator = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, phone, role } = req.body;
  if (!name || !email || !password || !phone) {
    return res.status(400).json({
      success: false,
      message: "All fields are required: name, email, password, phone",
    });
  }

  // email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  // password length
  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be 'String' & at least 6 characters long",
    });
  }
  // phone number
  if (phone.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Phone number is too short",
    });
  }

  const validRoles = ["admin", "customer"];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Role must be either 'admin' or 'customer'",
    });
  }

  next();
};

const tokenAuthorizer = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token = req.headers.authorization;
      if (!token)
        return res.status(401).json({
          success: false,
          message: "Invalid authorization token",
        });
      const TokenArr = token?.split(" ");
      token = TokenArr?.[1];
      const decodeJWTToken = jwt.verify(
        token,
        config.jwt_secret as string
      ) as JwtPayload;
      console.log(decodeJWTToken);
      req.user = decodeJWTToken;

      if (roles && !roles.includes(decodeJWTToken.role))
        return res.status(401).json({
          success: false,
          message: "You are unauthorized",
        });

      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export const authMiddlewares = {
  signupValidator,
  tokenAuthorizer,
};
