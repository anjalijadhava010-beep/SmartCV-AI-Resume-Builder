import express from "express";
import Resume from "../models/Resume.js";

const router = express.Router();

// SAVE RESUME
router.post("/", async (req, res) => {
  try {
    if (Resume.db.readyState !== 1) {
      return res.status(503).json({
        message: "MongoDB is not connected."
      });
    }

    const resume = await Resume.create(req.body);

    console.log("Resume saved successfully:", resume._id);

    res.status(201).json({
      message: "Resume saved successfully!",
      resume
    });

  } catch (error) {
    console.error("SAVE RESUME ERROR:", error);

    res.status(500).json({
      message: "Could not save resume.",
      detail: error.message
    });
  }
});

// LOAD LATEST RESUME
router.get("/latest", async (req, res) => {
  try {
    if (Resume.db.readyState !== 1) {
      return res.status(503).json({
        message: "MongoDB is not connected."
      });
    }

    const resume = await Resume.findOne().sort({
      updatedAt: -1
    });

    if (!resume) {
      return res.status(404).json({
        message: "No saved resume found."
      });
    }

    res.status(200).json({ resume });

  } catch (error) {
    console.error("LOAD RESUME ERROR:", error);

    res.status(500).json({
      message: "Could not load resume.",
      detail: error.message
    });
  }
});

export default router;