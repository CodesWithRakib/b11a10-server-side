import mongoose from "mongoose";

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

export default Plant;
