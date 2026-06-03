import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const VoiceCommand = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        if (event.results[current].isFinal) {
          processCommand(transcript.toLowerCase());
        }
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e) => {
        setIsListening(false);
        if (e.error !== 'no-speech') toast.error('Voice recognition error: ' + e.error);
      };

      recognitionRef.current = recognition;
    }
  }, [lang]);

  const processCommand = (text) => {
    // Skill keywords (Hindi + English)
    const skillMap = {
      plumber: ['plumber', 'plumbar', 'प्लंबर', 'nalkewala', 'pipe'],
      electrician: ['electrician', 'electric', 'bijli', 'बिजली', 'इलेक्ट्रीशियन'],
      housekeeping: ['housekeeping', 'safai', 'सफाई', 'cleaning', 'maid', 'bai', 'बाई'],
      carpenter: ['carpenter', 'badhai', 'बढ़ई', 'furniture', 'wood'],
      driver: ['driver', 'चालक', 'gaadi', 'गाड़ी', 'car driver'],
      cook: ['cook', 'rasoia', 'रसोइया', 'khana', 'खाना', 'chef', 'bawarchhi']
    };

    // City extraction (common Indian cities)
    const cities = ['delhi', 'mumbai', 'bangalore', 'hyderabad', 'chennai', 'kolkata',
      'pune', 'ahmedabad', 'jaipur', 'lucknow', 'bhopal', 'indore', 'nagpur', 'surat',
      'दिल्ली', 'मुंबई', 'बैंगलोर', 'चेन्नई', 'जयपुर', 'लखनऊ', 'भोपाल', 'इंदौर'];

    let detectedSkill = null;
    let detectedCity = null;

    // Detect skill
    for (const [skill, keywords] of Object.entries(skillMap)) {
      if (keywords.some(kw => text.includes(kw))) {
        detectedSkill = skill;
        break;
      }
    }

    // Detect city
    for (const city of cities) {
      if (text.includes(city.toLowerCase())) {
        detectedCity = city;
        break;
      }
    }

    // Command: Post job / kaam do / kaam chahiye
    if (text.includes('post') || text.includes('kaam do') || text.includes('kaam chahiye') ||
        text.includes('काम दो') || text.includes('काम चाहिए')) {
      toast.success('Kaam post karne ja rahe hain!');
      navigate('/post-job');
      return;
    }

    // Command: Bulk hire
    if (text.includes('bulk') || text.includes('company') || text.includes('bahut saare') ||
        text.includes('बहुत सारे') || text.includes('many workers')) {
      toast.success('Bulk hiring page khul raha hai!');
      navigate('/bulk-hire');
      return;
    }

    // Command: Dashboard / mere kaam
    if (text.includes('dashboard') || text.includes('mere kaam') || text.includes('mera') ||
        text.includes('मेरे काम') || text.includes('my work')) {
      navigate('/dashboard');
      return;
    }

    // Command: Jobs
    if (text.includes('jobs') || text.includes('kaam dhundho') || text.includes('काम ढूंढो')) {
      navigate('/jobs');
      return;
    }

    // Navigate to search with params
    if (detectedSkill || detectedCity) {
      const params = new URLSearchParams();
      if (detectedSkill) params.set('skill', detectedSkill);
      if (detectedCity) params.set('city', detectedCity);

      const skillName = t.skills[detectedSkill] || detectedSkill;
      toast.success(`${skillName} ${detectedCity ? detectedCity + ' mein' : ''} dhundh raha hun...`);
      navigate(`/search?${params.toString()}`);
      return;
    }

    toast(`Samajh nahi aaya: "${text}"\n${t.voiceHint}`, { icon: '🤔' });
    setTranscript('');
  };

  const startListening = () => {
    if (!recognitionRef.current) return;
    setTranscript('');
    recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognitionRef.current.start();
    setIsListening(true);
    toast('Bol dein... 🎤', { icon: '👂', duration: 2000 });
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
  };

  if (!isSupported) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 999,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8
    }}>
      {/* Transcript bubble */}
      {transcript && (
        <div style={{
          background: 'white', borderRadius: 12, padding: '8px 14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', maxWidth: 200,
          fontSize: 13, color: '#333', fontStyle: 'italic'
        }}>
          "{transcript}"
        </div>
      )}

      {/* Hint */}
      {!isListening && (
        <div style={{
          background: '#FF6B3520', borderRadius: 8, padding: '4px 10px',
          fontSize: 11, color: '#FF6B35', fontWeight: 600
        }}>
          🎤 {lang === 'hi' ? 'Voice Command' : 'Voice Command'}
        </div>
      )}

      {/* Voice Button */}
      <button
        onClick={isListening ? stopListening : startListening}
        className={isListening ? 'pulse' : ''}
        style={{
          width: 60, height: 60, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: isListening ? '#E74C3C' : '#FF6B35',
          color: 'white', fontSize: '1.5rem',
          boxShadow: '0 4px 16px rgba(255,107,53,0.4)',
          transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        {isListening ? '⏹️' : '🎤'}
      </button>
    </div>
  );
};

export default VoiceCommand;
