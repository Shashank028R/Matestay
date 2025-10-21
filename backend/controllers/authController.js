import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js"; // Ensure this path is correct

// --- register FUNCTION (Updated Email Content) ---
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({ name, email, password: hashedPassword });

    // Generate a short-lived token specifically for email verification
    const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // Keep it reasonably short, e.g., 1 day
    });

    const verifyLink = `${process.env.CLIENT_URL}/verify/${verificationToken}`;

    // --- NEW Email Subject and Body ---
    const emailSubject = "Verify Your Email Address for Matestay";
    const emailBody = `
Dear ${name},

Welcome to Matestay! We're glad to have you.

To complete your registration and activate your account, please verify your email address by clicking the link below:

${verifyLink}

If you did not create an account with Matestay, please disregard this email.

This link will expire in 24 hours. If you need assistance, please contact our support team.

Sincerely,
The Matestay Team
`;
    // --- END NEW Content ---

    await sendEmail(user.email, emailSubject, emailBody);

    res.status(201).json({ message: "Registration successful. Please check your email to verify your account." }); // Updated success message

  } catch (error) {
    console.error("Error during registration:", error); // Added error logging
    // More specific error handling could be added here
    res.status(500).json({ message: "Server error during registration" });
  }
};

// --- verifyEmail FUNCTION (No changes needed) ---
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "Invalid verification token." });
    }
    if (user.verified) {
        return res.status(200).json({ message: "Email is already verified." }); // Handle already verified case
    }

    user.verified = true;
    await user.save();
    // Maybe redirect user to login page or a "success" page on frontend?
    res.status(200).json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
      console.error("Error during email verification:", error);
      if (error.name === 'TokenExpiredError') {
          return res.status(400).json({ message: "Verification link has expired. Please register again or request a new link." });
      }
      if (error.name === 'JsonWebTokenError') {
          return res.status(400).json({ message: "Invalid verification token format." });
      }
    res.status(400).json({ message: "Email verification failed." });
  }
};

// --- login FUNCTION (No changes needed) ---
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." }); // More generic message for security
    }
    if (!user.verified) {
      return res.status(401).json({ message: "Please verify your email address before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // Standard login token duration
    });

    const userObject = user.toObject();
    delete userObject.password; // Ensure password is not sent

    res.status(200).json({
      token,
      user: userObject,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};