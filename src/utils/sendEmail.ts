import nodemailer from "nodemailer";
import config from "../config";

interface EmailOptions {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.NODEMAILER_EMAIL,
    pass: config.NODEMAILER_PASS,
  },
});

// Function to send an email
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const { from = config.NODEMAILER_EMAIL, to, subject, text, html } = options;

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};
