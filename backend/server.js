import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

import adminRoutes from "./routes/adminRoutes.js";
import consultationRoutes from "./routes/consultationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import creatorRoutes from "./routes/creatorRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";

import bookingRoutes from "./routes/bookingRoutes.js";

import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// 🔥 IMPORTANT: FRONTEND URLS
const allowedOrigins = [
  "http://localhost:5173",
  "https://influnexa-frontend.vercel.app",
];

// =======================
// 🔥 SOCKET SETUP
// =======================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

export { io };

io.on("connection", (socket) => {
  console.log("Admin Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});

// =======================
// 🔥 EXPRESS MIDDLEWARE
// =======================
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// 🔥 ROUTES
// =======================
app.use("/api/consultation", consultationRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/creator", creatorRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/bookings", bookingRoutes);

// static uploads
app.use("/uploads", express.static("uploads"));

// =======================
// 🔥 START SERVER
// =======================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});