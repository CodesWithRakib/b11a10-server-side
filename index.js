import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

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
connectDB();

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

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Server is running",
  });
});
app.get("/api/plants", async (req, res) => {
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
  const plant = req.body;
  console.log(plant);
  if (
    !plant.image ||
    !plant.plantName ||
    !plant.category ||
    !plant.description ||
    !plant.careLevel ||
    !plant.wateringFrequency ||
    !plant.lastWateredDate ||
    !plant.nextWateringDate ||
    !plant.healthStatus ||
    !plant.userEmail ||
    !plant.userName
  ) {
    return res
      .status(400)
      .json({ status: false, message: "All fields are required" });
  }

  const newPlant = new Plant(plant);
  try {
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
  const { id } = req.params;
  const plant = req.body;
  if (
    !plant.image ||
    !plant.plantName ||
    !plant.category ||
    !plant.description ||
    !plant.careLevel ||
    !plant.wateringFrequency ||
    !plant.lastWateredDate ||
    !plant.nextWateringDate ||
    !plant.healthStatus ||
    !plant.userEmail ||
    !plant.userName
  ) {
    return res
      .status(400)
      .json({ status: false, message: "All fields are required" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ status: false, message: "Invalid plant ID" });
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

export default app;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
