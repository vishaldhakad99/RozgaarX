# 🔧 KaamWala - Local Worker Marketplace

> **काम ढूंढो, काम दो** | Find Work, Give Work

KaamWala ek MERN stack platform hai jo plumbers, electricians, housekeeping staff, carpenters, drivers aur cooks ko employers se connect karta hai. Hindi + English support ke saath voice commands bhi hain!

---

## ✨ Features

- 🔍 **Smart Search** — Skill + City ke basis par kaamgar dhundhein
- 🎤 **Voice Commands** — Hindi & English mein bolkar kaam karo
  - `"Plumber khojo Delhi mein"` → Search page
  - `"Kaam post karo"` → Post job
  - `"Bulk hire"` → Bulk hiring page
- 🏢 **Bulk Hiring** — Companies ke liye ek saath 10-100 workers
- 📋 **Job Posting** — Employers kaam post kar sakte hain
- ⭐ **Reviews & Ratings** — Verified worker reviews
- 📱 **Mobile Responsive** — Phone par bhi smooth experience
- 🌐 **Hindi + English** — Language toggle button se switch karein

---

## 🗂️ Project Structure

```
kaamwala/
├── backend/                  # Node.js + Express + MongoDB
│   ├── models/
│   │   ├── User.js
│   │   ├── Worker.js
│   │   ├── Job.js
│   │   ├── Booking.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── workers.js
│   │   ├── jobs.js
│   │   ├── bookings.js
│   │   ├── reviews.js
│   │   └── bulk.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/                 # React.js
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Navbar.js
        │   ├── VoiceCommand.js
        │   ├── WorkerCard.js
        │   └── ProtectedRoute.js
        ├── context/
        │   ├── AuthContext.js
        │   └── LanguageContext.js
        ├── pages/
        │   ├── HomePage.js
        │   ├── SearchPage.js
        │   ├── WorkerDetailPage.js
        │   ├── JobsPage.js
        │   ├── LoginPage.js
        │   ├── RegisterPage.js
        │   ├── DashboardPage.js
        │   ├── PostJobPage.js
        │   ├── BulkHirePage.js
        │   └── WorkerProfileSetup.js
        ├── App.js
        ├── App.css
        └── index.js
```

---

## 🚀 Local Setup (Step by Step)

### Step 1: MongoDB Atlas Setup (FREE)

1. **[mongodb.com/atlas](https://mongodb.com/atlas)** par jaayein → Free account banayein
2. **"Create a cluster"** → Free M0 tier chunein
3. **Database Access** → New user banayein (username + password yaad rakhen)
4. **Network Access** → `0.0.0.0/0` add karein (sabke liye access)
5. **Connect** → "Connect your application" → Connection string copy karein

### Step 2: Backend Setup

```bash
# Backend folder mein jaayein
cd kaamwala/backend

# Dependencies install karein
npm install

# .env file banayein
cp .env.example .env
```

Ab `.env` file kholein aur fill karein:
```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster0.xxxxx.mongodb.net/kaamwala
JWT_SECRET=kaamwala_apna_secret_key_yahan_likhen_2024
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

```bash
# Backend start karein
npm run dev
# ✅ "KaamWala Server running on port 5000" dikhna chahiye
```

### Step 3: Frontend Setup

```bash
# Naya terminal kholein
cd kaamwala/frontend

# Dependencies install karein
npm install

# .env file banayein
cp .env.example .env
# REACT_APP_API_URL=http://localhost:5000/api (already set hai)

# Frontend start karein
npm start
# ✅ Browser mein http://localhost:3000 khulega
```

---

## 🌐 FREE Deployment

### Backend → Render.com (FREE)

1. **[render.com](https://render.com)** par jaayein → GitHub se login
2. **New Web Service** → GitHub repo connect karein
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. **Environment Variables** add karein (same as .env):
   - `MONGODB_URI` = apni Atlas URI
   - `JWT_SECRET` = apna secret
   - `FRONTEND_URL` = Vercel URL (baad mein add karein)
5. Deploy karein → URL milega jaise `https://kaamwala-api.onrender.com`

### Frontend → Vercel.com (FREE)

1. **[vercel.com](https://vercel.com)** par jaayein → GitHub se login
2. **Import Project** → Repo select karein
3. Settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
4. **Environment Variables:**
   - `REACT_APP_API_URL` = `https://kaamwala-api.onrender.com/api`
5. Deploy karein → URL milega jaise `https://kaamwala.vercel.app`

### Final Step: Render mein FRONTEND_URL update karein
Render dashboard → Environment → `FRONTEND_URL` = Vercel URL

---

## 🎤 Voice Commands Guide

| Bolein | Kya hoga |
|--------|----------|
| `"Plumber khojo Delhi mein"` | Delhi mein plumbers search |
| `"Find electrician Mumbai"` | Mumbai mein electricians |
| `"Housekeeping chahiye Pune mein"` | Pune mein housekeeping |
| `"Kaam post karo"` / `"Post a job"` | Job posting page |
| `"Bulk hire"` / `"Bahut saare workers"` | Bulk hiring page |
| `"Mera dashboard"` / `"My dashboard"` | Dashboard page |
| `"Kaam dhundho"` / `"Jobs"` | Available jobs list |

---

## 📱 User Roles

| Role | Kya kar sakte hain |
|------|-------------------|
| **Worker** (👷) | Profile banao, jobs search karo, apply karo, availability toggle karo |
| **Employer** (🏠) | Workers search karo, jobs post karo, book karo, review do |
| **Company** (🏢) | Bulk hiring karo, multiple workers ek saath book karo |

---

## 🛠️ API Endpoints

```
POST   /api/auth/register        # Register
POST   /api/auth/login           # Login
GET    /api/auth/me              # Profile

GET    /api/workers              # Search workers (?skill=&city=)
GET    /api/workers/:id          # Worker detail
POST   /api/workers/profile      # Worker profile banao
PUT    /api/workers/profile      # Profile update
PUT    /api/workers/toggle-availability

GET    /api/jobs                 # Jobs list
POST   /api/jobs                 # Job post karo
GET    /api/jobs/my              # Mere jobs
POST   /api/jobs/:id/apply       # Apply for job

POST   /api/bookings             # Booking karo
GET    /api/bookings/my          # Meri bookings
PUT    /api/bookings/:id/status  # Status update

POST   /api/reviews              # Review do
GET    /api/reviews/worker/:id   # Worker reviews

POST   /api/bulk/hire            # Bulk workers search + job create
POST   /api/bulk/confirm         # Bulk booking confirm
GET    /api/bulk/search          # Quick bulk search
```

---

## 🔮 Future Features (Next Version)

- [ ] OTP based login (Twilio/MSG91)
- [ ] WhatsApp notifications
- [ ] Google Maps integration
- [ ] In-app payment (Razorpay)
- [ ] Worker Aadhaar verification
- [ ] Chat between worker & employer
- [ ] Mobile App (React Native)
- [ ] Admin dashboard

---

## 📞 Support

Koi problem ho toh README dobara padhen ya issue raise karein.

**Made with ❤️ for India's workforce**
