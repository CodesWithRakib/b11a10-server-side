import express from "express";
import {
  addPlant,
  deletePlant,
  getAllPlants,
  getPlantById,
  updatePlant,
} from "../controllers/plant-controllers.js";

const router = express.Router();

router.get("/", getAllPlants);
router.get("/:id", getPlantById);
router.post("/", addPlant);
router.put("/:id", updatePlant);
router.delete("/:id", deletePlant);

export default router;
