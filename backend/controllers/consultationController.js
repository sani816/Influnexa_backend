import Consultation from "../models/Consultation.js";
import nodemailer from "nodemailer";

export const bookConsultation = async (req, res) => {
  try {
    const { name, email, date, time } = req.body;

    const consultation =
      await Consultation.create({
        name,
        email,
        date,
        time,
      });

    const transporter =
      nodemailer.createTransport({
        service: "gmail",

        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: process.env.EMAIL_USER,

      subject: "New Consultation Booking",

      html: `
        <h2>New Consultation Request</h2>

        <p><b>Name:</b> ${name}</p>

        <p><b>Email:</b> ${email}</p>

        <p><b>Date:</b> ${date}</p>

        <p><b>Time:</b> ${time}</p>
      `,
    });

    res.status(201).json({
      success: true,
      message:
        "Consultation booked successfully",
      consultation,
    });
  } catch (error) {
  console.error("BOOKING ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};