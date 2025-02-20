import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModels";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; 

console.log(SECRET_KEY);

passport.use(
new BearerStrategy(
  async (token, done) => {  // Marking the callback as async
    try {
      // Verify JWT token
    //   const decoded = jwt.verify(token, SECRET_KEY) as { id: string; name: string };
      const decoded = jwt.verify(token, SECRET_KEY) as {phone: string };

      // Simulate fetching user from DB
      const user = await UserModel.find({ phone: decoded.phone }).exec(); // Replace with actual DB lookup

      if (!user) {
        return done(null, false); // User not found
      }

      return done(null, user); // Successfully authenticated
    } catch (error) {
      return done(null, false); // Invalid token
    }
  })
);

export default passport;
