const express = require("express");
const multer = require("multer");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { DeepgramClient } = require("@deepgram/sdk");

const Transcription = require("../models/Transcription");

const router = express.Router();

const deepgram = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed!"), false);
    }
  },
});

// JWT Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      message: "No token, authorization denied",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token is not valid",
    });
  }
};

router.post(
  "/",
  authenticate,
  upload.single("audio"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No audio file uploaded",
        });
      }

      const audioBuffer = fs.readFileSync(req.file.path);

      const response = await deepgram.listen.v1.media.transcribeFile(
        audioBuffer,
        {
          model: "nova-3",
          smart_format: true,
          language: "en",
        }
      );

      const transcript =
        response.results?.channels?.[0]?.alternatives?.[0]?.transcript ||
        "Could not transcribe any speech.";

      const newTranscription = new Transcription({
        userId: req.user.id,
        filename: req.file.originalname,
        text: transcript,
        duration: response.metadata?.duration || 0,
      });

      await newTranscription.save();

      fs.unlinkSync(req.file.path);

      res.json(newTranscription);
    } catch (error) {
      console.error("Deepgram Error:", error);

      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        message: "Transcription failed",
        error: error.message,
      });
    }
  }
);

router.get("/history", authenticate, async (req, res) => {
  try {
    const transcriptions = await Transcription.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(transcriptions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;