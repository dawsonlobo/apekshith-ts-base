import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModels";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret";

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const decoded = jwt.verify(token, ACCESS_SECRET) as { id: string };

      const user = await UserModel.findById(decoded.id);
      if (!user) return done(null, false);

      return done(null, user);
    } catch (error) {
      return done(null, false);
    }
  })
);

export default passport;
