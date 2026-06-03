import React, { createContext, useContext, useState } from 'react';

const translations = {
  hi: {
    appName: 'कामवाला',
    tagline: 'काम ढूंढो, काम दो',
    home: 'होम',
    search: 'खोजें',
    jobs: 'काम',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    dashboard: 'डैशबोर्ड',
    postJob: 'काम पोस्ट करें',
    bulkHire: 'बल्क भर्ती',
    logout: 'लॉगआउट',
    searchPlaceholder: 'प्लंबर, इलेक्ट्रीशियन, कुक... खोजें',
    cityPlaceholder: 'शहर लिखें',
    findWorkers: 'कामगार खोजें',
    hireNow: 'अभी काम पर रखें',
    viewProfile: 'प्रोफाइल देखें',
    applyNow: 'अभी अप्लाई करें',
    available: 'उपलब्ध',
    unavailable: 'अनुपलब्ध',
    rating: 'रेटिंग',
    experience: 'अनुभव',
    dailyRate: 'रोज का रेट',
    perDay: '/दिन',
    perHour: '/घंटा',
    years: 'साल',
    jobs_done: 'काम किए',
    skills: {
      plumber: 'प्लंबर 🔧',
      electrician: 'इलेक्ट्रीशियन ⚡',
      housekeeping: 'सफाई कर्मचारी 🧹',
      carpenter: 'बढ़ई 🪚',
      driver: 'ड्राइवर 🚗',
      cook: 'रसोइया 👨‍🍳',
      painter: 'पेंटर 🎨',
      gardener: 'माली 🌿',
      security: 'सुरक्षा गार्ड 🛡️',
      other: 'अन्य'
    },
    voiceHint: 'बोलें: "प्लंबर खोजो दिल्ली में"',
    bulkHireTitle: 'बल्क में कामगार चाहिए?',
    bulkHireDesc: 'कंपनियों के लिए - एक साथ 10-100 कामगार बुक करें',
    noWorkers: 'कोई कामगार नहीं मिला',
    loading: 'लोड हो रहा है...',
    bookNow: 'बुक करें',
    contactWorker: 'कामगार से संपर्क करें',
    reviews: 'समीक्षाएं',
    writeReview: 'समीक्षा लिखें',
    cancel: 'रद्द करें',
    confirm: 'पक्का करें',
    save: 'सेव करें',
    name: 'नाम',
    phone: 'फोन नंबर',
    password: 'पासवर्ड',
    city: 'शहर',
    role_worker: 'मुझे काम चाहिए (कामगार)',
    role_employer: 'मुझे कामगार चाहिए (नियोक्ता)',
    role_company: 'कंपनी / बिज़नेस',
    registerSuccess: 'रजिस्ट्रेशन हो गया! KaamWala में स्वागत है 🎉',
    loginSuccess: 'लॉगिन हो गया!',
    urgency: { normal: 'सामान्य', urgent: 'जल्दी', 'very-urgent': 'बहुत जल्दी' }
  },
  en: {
    appName: 'KaamWala',
    tagline: 'Find Work, Give Work',
    home: 'Home',
    search: 'Search',
    jobs: 'Jobs',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    postJob: 'Post a Job',
    bulkHire: 'Bulk Hire',
    logout: 'Logout',
    searchPlaceholder: 'Search plumber, electrician, cook...',
    cityPlaceholder: 'Enter city',
    findWorkers: 'Find Workers',
    hireNow: 'Hire Now',
    viewProfile: 'View Profile',
    applyNow: 'Apply Now',
    available: 'Available',
    unavailable: 'Unavailable',
    rating: 'Rating',
    experience: 'Experience',
    dailyRate: 'Daily Rate',
    perDay: '/day',
    perHour: '/hour',
    years: 'yrs',
    jobs_done: 'Jobs Done',
    skills: {
      plumber: 'Plumber 🔧',
      electrician: 'Electrician ⚡',
      housekeeping: 'Housekeeping 🧹',
      carpenter: 'Carpenter 🪚',
      driver: 'Driver 🚗',
      cook: 'Cook 👨‍🍳',
      painter: 'Painter 🎨',
      gardener: 'Gardener 🌿',
      security: 'Security Guard 🛡️',
      other: 'Other'
    },
    voiceHint: 'Say: "Find plumber in Delhi"',
    bulkHireTitle: 'Need Workers in Bulk?',
    bulkHireDesc: 'For companies - Book 10-100 workers at once',
    noWorkers: 'No workers found',
    loading: 'Loading...',
    bookNow: 'Book Now',
    contactWorker: 'Contact Worker',
    reviews: 'Reviews',
    writeReview: 'Write Review',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    name: 'Name',
    phone: 'Phone Number',
    password: 'Password',
    city: 'City',
    role_worker: 'I need work (Worker)',
    role_employer: 'I need workers (Employer)',
    role_company: 'Company / Business',
    registerSuccess: 'Registered! Welcome to KaamWala 🎉',
    loginSuccess: 'Login successful!',
    urgency: { normal: 'Normal', urgent: 'Urgent', 'very-urgent': 'Very Urgent' }
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('kw_lang') || 'hi');
  const t = translations[lang];

  const toggleLang = () => {
    const newLang = lang === 'hi' ? 'en' : 'hi';
    setLang(newLang);
    localStorage.setItem('kw_lang', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;
