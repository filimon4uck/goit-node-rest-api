import "dotenv/config";
import sgMail from '@sendgrid/mail';
import HttpError from "./HttpError.js";
export const sendEmail = async (msg) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send(msg);
  } catch (_) {
    throw HttpError(500, "Error send email");
  }
};