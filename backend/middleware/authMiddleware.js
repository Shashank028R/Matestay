import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  console.log("Protect Middleware: Running..."); // Log P1

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Protect Middleware: Token found."); // Log P2
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Protect Middleware: Token decoded:", decoded); // Log P3 - Check decoded.id

      // Check if decoded.id is valid before querying DB
      if (!decoded || !decoded.id) {
         console.error("Protect Middleware: Decoded token missing ID."); // Log P3.1
         return res.status(401).json({ message: "Not authorized, invalid token payload" });
      }

      // Fetch user from DB using the ID from the token
      req.user = await User.findById(decoded.id).select("-password");
      // Mongoose documents have ._id, but .id usually works as a virtual getter. Let's log both.
      console.log("Protect Middleware: User found from DB (req.user._id):", req.user?._id?.toString()); // Log P4
      console.log("Protect Middleware: User virtual ID (req.user.id):", req.user?.id); // Log P4.1

      if (!req.user) {
         console.error("Protect Middleware: User not found in DB for decoded ID:", decoded.id); // Log P4.2
         return res.status(401).json({ message: "Not authorized, user not found" });
      }
      console.log("Protect Middleware: Attaching user to req and calling next()."); // Log P5
      next(); // Proceed to the next middleware/controller
    } catch (error) {
      console.error('Protect Middleware: Error during verification/DB lookup:', error); // Log P6
      // Differentiate between token expiration and other errors if possible
      if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ message: "Not authorized, token expired" });
      }
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log("Protect Middleware: No Bearer token found in headers."); // Log P7
    // This part might be technically unreachable if token isn't defined, but good for clarity.
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  }
};