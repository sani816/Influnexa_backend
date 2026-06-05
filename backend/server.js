import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "path";


import adminRoutes from "./routes/adminRoutes.js";
import consultationRoutes from "./routes/consultationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import creatorRoutes from "./routes/creatorRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import notificationRoutes from "./routes/notifcationRoute.js";

import connectDB from "./config/db.js";

dotenv.config();

// DB CONNECTION (ONLY ONCE)
connectDB();

const app = express();

// HTTP SERVER (FOR SOCKET)
const server = http.createServer(app);

// SOCKET SETUP
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

export { io };

// SOCKET EVENTS
io.on("connection", (socket) => {
  console.log("Admin Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});

app.use(express.urlencoded({ extended: true }));
// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES (IMPORTANT FIX HERE)
app.use("/api/consultation", consultationRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/creator", creatorRoutes);

// ✅ FIXED BRAND ROUTE
app.use("/api/brands", brandRoutes);

app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static("uploads"));
app.use(
  "/api/notifications",
  notificationRoutes
);

// SERVER START
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});