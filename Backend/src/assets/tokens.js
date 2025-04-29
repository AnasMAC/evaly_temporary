import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
export function generateAccessToken(user) {
  return jwt.sign(
    {
      cin: user.cin,
      role: user.role,
    },
    process.env.ACCESS_SECRET,
    {
      expiresIn: "13m",
    }
  );
}

export function generateRefreshToken(user) {
  const tokenID = crypto.randomBytes(16).toString("hex");
  const refreshToken = jwt.sign(
    {
      cin: user.cin,
      tokenID: tokenID,
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return { refreshToken, tokenID };
}