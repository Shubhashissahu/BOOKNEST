
// server.js
import dotenv from "dotenv";
dotenv.config(); // ← Still must be FIRST

import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));