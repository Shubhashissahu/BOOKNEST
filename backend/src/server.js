import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import bookRoutes from "./routes/books.js";
import authRoutes from "./routes/auth.js"; // ← ADD THIS

dotenv.config();
connectDB();

const app = express();   

app.use(cors());
app.use(express.json());

app.use("/api/books", bookRoutes);  
app.use("/api/auth", authRoutes); // ← ADD THIS
app.get("/", (req, res) => {
  res.send("Backend is running ");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});