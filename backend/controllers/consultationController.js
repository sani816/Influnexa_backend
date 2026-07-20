import Consultation from "../models/Consultation.js";
import nodemailer from "nodemailer";
import { io } from "../server.js";

export const bookConsultation = async (req, res) => {
  try {
    const { name, email,company,budget, date, time,message } = req.body;

    const consultation =
      await Consultation.create({
        name,
        email,
        company,
        budget,
        date,
        time,
        message,
      });

    // const transporter =
    //   nodemailer.createTransport({
    //     service: "gmail",

    //     auth: {
    //       user: process.env.EMAIL_USER,
    //       pass: process.env.EMAIL_PASS,
    //     },
    //   });

    // await transporter.sendMail({
    //   from: process.env.EMAIL_USER,

    //   to: process.env.EMAIL_USER,

    //   subject: "New Consultation Booking",

    //   html: `
    //     <h2>New Consultation Request</h2>

    //     <p><b>Name:</b> ${name}</p>

    //     <p><b>Email:</b> ${email}</p>

    //     <p><b>Date:</b> ${date}</p>

    //     <p><b>Time:</b> ${time}</p>
    //   `,
    // });
io.emit("booking-update", consultation);
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

// ===============================
// GET ALL CONSULTATIONS
// ===============================
export const getAllConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      consultations,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// DELETE CONSULTATION
// ===============================
export const deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    const consultation = await Consultation.findByIdAndDelete(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    io.emit("delete-booking", id);

    res.status(200).json({
      success: true,
      message: "Consultation deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};