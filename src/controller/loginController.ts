import { NextFunction, Router,Request,Response } from "express";
import jwt from "jsonwebtoken";

const router = Router();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// Dummy user database
const users = [{ id: "1", username: "john", password: "1234" }];





// Login route - Generates JWT token

export async function login(req:Request,res:Response,next:NextFunction):Promise<void> {
    

  const { username, password } = req.body;

  // Find user
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
     res.status(401).json({ message: "Invalid credentials" });
     return;
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id, name: user.username }, SECRET_KEY, { expiresIn: "1h" });

  res.json({ token });
};

export default router;
