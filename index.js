import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import ServerlessHttp from "serverless-http";
dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB

const connectDB = async () => {
  try {
    const db = process.env.MONGODB_URI;
    const conn = await mongoose.connect(db);
    console.log("MongoDB connected successfully to", conn.connection.name);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Schema and Model

const plantSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    plantName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["succulent", "fern", "flowering"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    careLevel: {
      type: String,
      enum: ["easy", "moderate", "difficult"],
      required: true,
    },
    wateringFrequency: {
      type: String,
      required: true,
    },
    lastWateredDate: {
      type: Date,
      required: true,
    },
    nextWateringDate: {
      type: Date,
      required: true,
    },
    healthStatus: {
      type: String,
      enum: ["healthy", "average", "needs attention", "dying"],
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      immutable: true, // makes the field read-only after creation
    },
    userName: {
      type: String,
      required: true,
      immutable: true, // makes the field read-only after creation
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields automatically
  }
);
const Plant = mongoose.model("Plant", plantSchema);

// Connect to MongoDB
let dbConnection;
connectDB()
  .then(() => {
    dbConnection = true;
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    dbConnection = false;
  });

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Server is running",
    dbStatus: dbConnection ? "connected" : "disconnected",
  });
});
app.get("/api/plants", async (req, res) => {
  if (!dbConnection) {
    return res.status(500).json({
      status: false,
      message: "Database connection error",
    });
  }
  try {
    const plants = await Plant.find();
    res.status(200).json({
      status: true,
      message: "Plants retrieved successfully",
      data: plants,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to retrieve plants",
      error: error.message,
    });
  }
});
app.get("/api/plants/:id", async (req, res) => {
  if (!dbConnection) {
    return res.status(500).json({
      status: false,
      message: "Database connection error",
    });
  }

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ status: false, message: "Invalid plant ID" });
  }
  try {
    const plant = await Plant.findById(id);
    if (!plant) {
      return res
        .status(404)
        .json({ status: false, message: "Plant not found" });
    }
    res.status(200).json({ status: true, data: plant });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Failed to retrieve plant", error });
  }
});

app.post("/api/plants", async (req, res) => {
  if (!dbConnection) {
    return res.status(500).json({
      status: false,
      message: "Database connection error",
    });
  }

  const plant = req.body;
  console.log(plant);
  const requiredFields = [
    "image",
    "plantName",
    "category",
    "description",
    "careLevel",
    "wateringFrequency",
    "lastWateredDate",
    "nextWateringDate",
    "healthStatus",
    "userEmail",
    "userName",
  ];

  const missingFields = requiredFields.filter((field) => !plant[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      status: false,
      message: "All fields are required",
      missingFields,
    });
  }
  try {
    const newPlant = new Plant(plant);
    await newPlant.save();
    res.status(201).json({
      status: true,
      message: "Plant added successfully",
      data: newPlant,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to add plant",
      error: error.message,
    });
  }
});

app.put("/api/plants/:id", async (req, res) => {
  if (!dbConnection) {
    return res.status(503).json({
      status: false,
      message: "Database not connected",
    });
  }
  const { id } = req.params;
  const plant = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ status: false, message: "Invalid plant ID" });
  }

  const requiredFields = [
    "image",
    "plantName",
    "category",
    "description",
    "careLevel",
    "wateringFrequency",
    "lastWateredDate",
    "nextWateringDate",
    "healthStatus",
    "userEmail",
    "userName",
  ];

  const missingFields = requiredFields.filter((field) => !plant[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      status: false,
      message: "All fields are required",
      missingFields,
    });
  }

  try {
    const updatedPlant = await Plant.findByIdAndUpdate(id, plant, {
      new: true,
    });
    if (!updatedPlant) {
      return res
        .status(404)
        .json({ status: false, message: "Plant not found" });
    }
    res.status(200).json({
      status: true,
      message: "Plant updated successfully",
      data: updatedPlant,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to update plant",
      error: error.message,
    });
  }
});

app.delete("/api/plants/:id", async (req, res) => {
  if (!dbConnection) {
    return res.status(503).json({
      status: false,
      message: "Database not connected",
    });
  }

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ status: false, message: "Invalid plant ID" });
  }
  try {
    const deletedPlant = await Plant.findByIdAndDelete(id);
    if (!deletedPlant) {
      return res
        .status(404)
        .json({ status: false, message: "Plant not found" });
    }
    res.status(200).json({
      status: true,
      message: "Plant deleted successfully",
      data: deletedPlant,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to delete plant",
      error: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Export for Vercel
export const handler = ServerlessHttp(app);

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
