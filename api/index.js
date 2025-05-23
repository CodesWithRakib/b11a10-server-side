import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import { connectDB } from "./config/db.js";
import plantRoutes from "./routes/plant-routes.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/plants", plantRoutes);

connectDB();
export default app;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
