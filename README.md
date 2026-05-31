# Vocalize - AI Speech-to-Text MERN Application

Vocalize is a premium, full-stack application that allows users to record or upload audio files and transform them into text using Google Cloud Speech-to-Text AI.

## ✨ Features

- **Auth**: Secure JWT-based user authentication (Login/Register).
- **Record**: Capture high-quality audio directly in your browser.
- **Upload**: Support for various audio formats (wav, mp3, m4a).
- **AI Transcription**: Powered by Google Cloud Speech-to-Text.
- **History**: Store and view your past transcriptions in a beautiful glassmorphic dashboard.
- **Design**: Premium dark mode UI with fluid animations.

## 🚀 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, Multer.
- **Database**: MongoDB (Mongoose).
- **Services**: Google Cloud Platform.

## 🛠️ Installation & Setup

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd speech-to-text

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Variables
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_APPLICATION_CREDENTIALS=./google-key.json
```

### 3. Google Cloud Credentials
1. Go to [GCP Console](https://console.cloud.google.com/).
2. Enable the **Cloud Speech-to-Text API**.
3. Create a **Service Account** and download the **JSON Key**.
4. Rename the key to `google-key.json` and place it in the `server/` directory.

### 4. Run the App
**Start Backend:**
```bash
cd server
node index.js
```

**Start Frontend:**
```bash
cd client
npm run dev
```

## 📝 Roadmap
- [x] Basic STT Integration
- [x] MERN Stack Setup
- [x] JWT Authentication
- [x] Premium UI/UX Refinement
- [ ] Multi-language Support
- [ ] Export Transcriptions as PDF/Word

## 📄 License
MIT
