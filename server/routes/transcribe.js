const express = require('express');
const multer = require('multer');
const speech = require('@google-cloud/speech');
const fs = require('fs');
const Transcription = require('../models/Transcription');
const jwt = require('jsonwebtoken');

const router = express.Router();
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'), false);
    }
  }
});

// Middleware to authenticate JWT
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const client = new speech.SpeechClient();

router.post('/', authenticate, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No audio file uploaded' });

    const fileBuffer = fs.readFileSync(req.file.path);
    const audioBytes = fileBuffer.toString('base64');

    const audio = {
      content: audioBytes,
    };
    const config = {
      encoding: 'LINEAR16', // This should match the audio format
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };
    const request = {
      audio: audio,
      config: config,
    };

    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    const newTranscription = new Transcription({
      userId: req.user.id,
      filename: req.file.originalname,
      text: transcription || 'Could not transcribe any speech.',
    });

    await newTranscription.save();

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json(newTranscription);
  } catch (error) {
    console.error('STT Error:', error);
    res.status(500).json({ message: 'Transcription failed', error: error.message });
  }
});

router.get('/history', authenticate, async (req, res) => {
  try {
    const transcriptions = await Transcription.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(transcriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
