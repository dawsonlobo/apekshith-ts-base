import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ id: userId }, ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET) as { id: string };
};
