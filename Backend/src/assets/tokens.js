import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
export function generateAccessToken(user) {
  const ACCESS_SECRET = 'accestoken'; // Hardcodé
  return jwt.sign(
    { cin: user.cin, role: user.role },
    ACCESS_SECRET,
    { expiresIn: "13m" }
  );
}

export function generateRefreshToken(user) {
  const REFRESH_SECRET = 'helloworld'; // Hardcodé
  const tokenID = crypto.randomBytes(16).toString("hex");
  
  const refreshToken = jwt.sign(
    { cin: user.cin, tokenID },
    REFRESH_SECRET, // Secret hardcodé
    { expiresIn: "7d" }
  );
  
  return { refreshToken, tokenID };
}