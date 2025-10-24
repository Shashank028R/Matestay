import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    // --- UPDATED TRANSPORTER CONFIGURATION ---
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Explicitly specify Gmail's SMTP server
      port: 465, // Use port 465 for SSL
      secure: true, // Use SSL (true for port 465, false for port 587/TLS)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Your Google App Password
      },
      // Optional: Add connection timeout (e.g., 15 seconds) if default is too short
      // connectionTimeout: 15000, 
    });
    // --- END UPDATED CONFIGURATION ---

    const mailOptions = {
        from: `"Matestay" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
    };

    console.log(`Attempting to send email to: ${to} with subject: ${subject}`);
    console.log(`Using email user: ${process.env.EMAIL_USER}`);

    let info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);

  } catch (error) {
    console.error("!!! Error sending email:", error); // Log the full error
    // Log specific details if available
    if (error.code) {
      console.error("Error Code:", error.code);
    }
    if (error.command) {
      console.error("Error Command:", error.command);
    }
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default sendEmail;