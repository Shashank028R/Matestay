import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    // --- UPDATED TRANSPORTER CONFIGURATION FOR PORT 587 ---
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Gmail's SMTP server
      port: 587, // Use port 587 for TLS
      secure: false, // Use TLS (STARTTLS) - false for port 587
      requireTLS: true, // Force TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Your Google App Password
      },
      // Optional: Increase timeout if needed, but the issue seems to be connection itself
      // connectionTimeout: 20000, // 20 seconds
      // logger: true, // Enable detailed logging from nodemailer (optional)
      // debug: true, // Enable debug output (optional)
    });
    // --- END UPDATED CONFIGURATION ---

    const mailOptions = {
        from: `"Matestay" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
    };

    console.log(`Attempting to send email (via port 587) to: ${to} with subject: ${subject}`);
    console.log(`Using email user: ${process.env.EMAIL_USER}`);

    let info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);

  } catch (error) {
    console.error("!!! Error sending email:", error); // Log the full error
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