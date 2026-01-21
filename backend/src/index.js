import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import apiRoutes from "./routes/api.routes.js";


const app = express();
const PORT = process.env.PORT || 3000;


dotenv.config();
connectDB();

app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Updated to match frontend port
    
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
); 

app.use(express.json());
app.use(cookieParser());
app.use("/api", apiRoutes);


const server=app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});