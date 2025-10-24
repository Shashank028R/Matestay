import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js"; // Ensure this path is correct

// --- register FUNCTION (Updated Logic) ---
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    // --- NEW LOGIC ---
    if (user) {
      // Check if the existing user is already verified
      if (user.verified) {
        // If verified, they cannot register again
        return res.status(400).json({ message: "User with this email already exists and is verified." });
      } else {
        // If user exists but is NOT verified, resend the verification email
        console.log(`User ${email} exists but not verified. Resending verification email.`);

        // Generate a new verification token (optional but recommended for security)
        const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d", // Or your preferred duration
        });
        const verifyLink = `${process.env.CLIENT_URL}/verify/${verificationToken}`;

        const emailSubject = "Verify Your Email Address for Matestay";
        const emailBody = `
Dear ${user.name},

It looks like you started registering for Matestay but didn't verify your email.

Please verify your email address by clicking the link below:

${verifyLink}

If you did not attempt to create an account, please disregard this email.

This link will expire in 24 hours.

Sincerely,
The Matestay Team
`;
        try {
            await sendEmail(user.email, emailSubject, emailBody);
            // Let the user know you resent the email
            return res.status(200).json({ message: "Account already registered. Verification email resent. Please check your inbox (and spam folder)." });
        } catch (emailError) {
             console.error("Error resending verification email:", emailError);
             return res.status(500).json({ message: "User exists, but failed to resend verification email." });
        }
      }
    }
    // --- END NEW LOGIC ---

    // If user does not exist, proceed with new registration
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({ name, email, password: hashedPassword });

    const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const verifyLink = `${process.env.CLIENT_URL}/verify/${verificationToken}`;
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
    await sendEmail(user.email, emailSubject, emailBody);

    res.status(201).json({ message: "Registration successful. Please check your email to verify your account." });

  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// --- verifyEmail FUNCTION --- (No changes needed here)
export const verifyEmail = async (req, res) => { /* ... */ };

// --- login FUNCTION --- (No changes needed here)
export const login = async (req, res) => { /* ... */ };