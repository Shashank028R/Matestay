import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try { // Added try...catch for better error handling
    const transporter = nodemailer.createTransport({
      service: "gmail", // Or your service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
        from: `"Matestay" <${process.env.EMAIL_USER}>`, // Ensure sender address is correct
        to,
        subject,
        text, // Or use `html` for HTML emails
    };

    console.log(`Attempting to send email to: ${to} with subject: ${subject}`); // Log before sending
    console.log(`Using email user: ${process.env.EMAIL_USER}`); // Log user (check if defined)
    // DO NOT log EMAIL_PASS here for security

    let info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully!"); // Log success
    console.log("Message ID:", info.messageId); // Log message ID
    // console.log("Preview URL:", nodemailer.getTestMessageUrl(info)); // Only for ethereal emails

  } catch (error) {
    console.error("!!! Error sending email:", error); // Log the full error
    // Re-throw the error so the calling function knows it failed
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default sendEmail;