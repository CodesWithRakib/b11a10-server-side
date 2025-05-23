import mongoose from "mongoose";
import Plant from "../models/plant-model.js";
export const getAllPlants = async (req, res) => {
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
};

export const getPlantById = async (req, res) => {
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
};
export const addPlant = async (req, res) => {
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
};

export const updatePlant = async (req, res) => {
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
};

export const deletePlant = async (req, res) => {
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
};
