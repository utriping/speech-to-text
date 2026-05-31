import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mic, Upload, History, FileText, Loader2, Play, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [transcribing, setTranscribing] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'history'

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/transcribe/history');
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch history');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => handleStopRecording(chunks);
      
      recorder.start();
      setIsRecording(true);
      setAudioChunks([]);
    } catch (err) {
      alert('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleStopRecording = async (chunks) => {
    const audioBlob = new Blob(chunks, { type: 'audio/webm' });
    sendAudioToTranscription(audioBlob, `recording_${Date.now()}.webm`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      sendAudioToTranscription(file, file.name);
    }
  };

  const sendAudioToTranscription = async (file, filename) => {
    setTranscribing(true);
    const formData = new FormData();
    formData.append('audio', file, filename);

    try {
      const res = await axios.post('http://localhost:5000/api/transcribe', formData);
      setHistory([res.data, ...history]);
      setActiveTab('history');
    } catch (err) {
      alert('Transcription failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setTranscribing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('new')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'new' ? 'glass text-white border-white/20' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Mic size={18} />
          New Transcription
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'history' ? 'glass text-white border-white/20' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <History size={18} />
          History
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'new' ? (
          <motion.div 
            key="new"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Record Section */}
            <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center text-center group transition-all hover:border-white/20">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/5 group-hover:bg-indigo-500/10'}`}>
                <Mic className={isRecording ? 'text-white' : 'text-indigo-400'} size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Record Audio</h3>
              <p className="text-slate-400 text-sm mb-6">Capture speech directly from your microphone</p>
              
              {!isRecording ? (
                <button 
                  onClick={startRecording}
                  disabled={transcribing}
                  className="w-full flex items-center justify-center gap-2 premium-gradient py-3 rounded-xl font-bold transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  <Play size={18} fill="currentColor" />
                  Start Recording
                </button>
              ) : (
                <button 
                  onClick={stopRecording}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 py-3 rounded-xl font-bold transition-all hover:scale-[1.02]"
                >
                  <Square size={18} fill="currentColor" />
                  Stop Recording
                </button>
              )}
            </div>

            {/* Upload Section */}
            <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center text-center group transition-all hover:border-white/20">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-purple-500/10 transition-all">
                <Upload className="text-purple-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload File</h3>
              <p className="text-slate-400 text-sm mb-6">Upload .wav, .mp3, or .m4a audio files</p>
              
              <label className="w-full flex items-center justify-center gap-2 bg-white/10 py-3 rounded-xl font-bold cursor-pointer transition-all hover:bg-white/20">
                <FileText size={18} />
                Browse Files
                <input type="file" className="hidden" accept="audio/*" onChange={handleFileUpload} disabled={transcribing} />
              </label>
            </div>

            {transcribing && (
              <div className="md:col-span-2 glass rounded-2xl p-4 flex items-center justify-center gap-3 text-indigo-400">
                <Loader2 className="animate-spin" />
                <span className="font-medium">Transcribing your audio using AI...</span>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {history.length === 0 ? (
              <div className="text-center py-20 text-slate-500 glass rounded-3xl">
                <History size={48} className="mx-auto mb-4 opacity-20" />
                <p>No transcriptions yet. Start by recording something!</p>
              </div>
            ) : (
              history.map((record) => (
                <div key={record._id} className="glass rounded-2xl p-6 transition-all hover:border-white/20">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-white">{record.filename}</h4>
                      <p className="text-xs text-slate-500">{new Date(record.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full border border-indigo-500/20">
                      Google STT
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                    {record.text}
                  </p>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
