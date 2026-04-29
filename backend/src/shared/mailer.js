import nodemailer from "nodemailer";
import { config } from "../config.js";

let transporter = null;
if (config.email && config.email.host && config.email.authUser) {
  transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port || 587,
    secure: config.email.secure || false,
    auth: {
      user: config.email.authUser,
      pass: config.email.authPass,
    },
  });
}

export async function sendEmail({ to, subject, text, html }) {
  if (!transporter) {
    console.log("[Mailer] Transport not configured; skipping email to", to);
    return null;
  }

  try {
    const info = await transporter.sendMail({
      from: config.email.from,
      to,
      subject,
      text,
      html,
    });
    console.log("[Mailer] Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("[Mailer] Failed to send email:", err && err.message ? err.message : err);
    return null;
  }
}
