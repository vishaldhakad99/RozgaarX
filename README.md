# 🔧 RozgaarX - Local Worker Marketplace

> **Find Work, Give Work | काम ढूंढो, काम दो**

RozgaarX is a full-stack MERN application built to connect local blue-collar workers and skilled tradespeople (such as plumbers, electricians, carpenters, housekeeping staff, drivers, and cooks) with individual households, employers, and enterprise contractors.

Equipped with bilingual support (Hindi + English) and an interactive Voice Command Assistant powered by the Web Speech API, RozgaarX makes discovering and hiring local talent friction-free and accessible to everyone.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture & Roles](#-system-architecture--roles)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Local Development Setup](#-local-development-setup)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Quick Start (Monorepo Helper)](#2-quick-start-monorepo-helper)
  - [3. Manual Setup (Backend & Frontend)](#3-manual-setup-backend--frontend)
- [Environment Configuration](#-environment-configuration)
- [API Reference](#-api-reference)
- [Voice Commands Guide](#-voice-commands-guide)
- [Deployment Guide](#-deployment-guide)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- 🔍 **Smart Worker Search & Discovery**: Filter verified workers by primary trade skill, location/city, hourly rate, and experience level.
- 🎤 **Interactive Voice Commands (Speech-to-Action)**: Navigate the platform hands-free in either Hindi or English:
  - *"Plumber khojo Delhi mein"* → Instant search query
  - *"Kaam post karo"* → Redirect to Job creation
  - *"Bulk hire"* → Direct company hiring workflow
- 🏢 **Bulk Hiring Portal**: Enables businesses, construction contractors, and event organizers to request 10–100+ workers in a single streamlined workflow.
- 📋 **Job Board & Application Tracking**: Employers can publish detailed job postings and review inbound worker applications.
- 👷 **Comprehensive Worker Profiles**: Tradespeople can showcase skills, experience, contact details, daily/hourly rates, and toggle live availability.
- ⭐ **Ratings & Reviews System**: Verified employer feedback and star ratings to build trusted community reputation.
- 🌐 **Bilingual Accessibility**: Instant one-click toggle between English and Hindi (`LanguageContext`).
- 📱 **Mobile-First Responsive UI**: Smooth and accessible across desktop monitors, tablets, and smartphones.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React.js](https://react.dev/) (v18)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **State & Context**: React Context API (`AuthContext`, `LanguageContext`)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons & UI Notifications**: `react-icons`, `react-hot-toast`
- **Speech Recognition**: HTML5 Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Web Framework**: [Express.js](https://expressjs.com/) (v4)
- **Database & ODM**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) (v8)
- **Authentication**: JWT ([jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)) & password hashing via [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Validation & Utilities**: `express-validator`, `multer` (multipart uploads), `cors`, `dotenv`

---

## 👥 System Architecture & Roles

| Role | Permissions & Capabilities |
| :--- | :--- |
| **Worker (👷)** | Set up a trade profile, list skills and pricing, browse jobs, submit job applications, and toggle availability. |
| **Employer (🏠)** | Search workers by skill and city, post job vacancies, hire workers directly, manage bookings, and leave reviews. |
| **Company / Recruiter (🏢)** | Bulk worker acquisition, multi-worker project contracts, and corporate workforce management. |

---

## 🗂️ Project Structure

```text
RozgaarX/
├── package.json              # Root orchestration scripts
├── README.md                 # Project documentation
├── .gitignore                # Global git ignore definitions
│
├── backend/                  # Node.js + Express API
│   ├── middleware/
│   │   └── auth.js           # JWT verification middleware
│   ├── models/
│   │   ├── User.js           # Base authentication user schema
│   │   ├── Worker.js         # Extended worker profile & skills schema
│   │   ├── Job.js            # Job postings and applications schema
│   │   ├── Booking.js        # Direct worker hiring & booking records
│   │   └── Review.js         # Feedback and star ratings schema
│   ├── routes/
│   │   ├── auth.js           # /api/auth (register, login, profile)
│   │   ├── workers.js        # /api/workers (search, profile, availability)
│   │   ├── jobs.js           # /api/jobs (post, list, apply)
│   │   ├── bookings.js       # /api/bookings (create, list, update status)
│   │   ├── reviews.js        # /api/reviews (create and fetch reviews)
│   │   └── bulk.js           # /api/bulk (enterprise bulk hiring)
│   ├── .env.example          # Sample environment variables for backend
│   ├── package.json          # Backend dependencies and scripts
│   └── server.js             # Express application entrypoint
│
└── frontend/                 # React SPA
    ├── public/
    │   └── index.html        # HTML template & metadata
    └── src/
        ├── components/
        │   ├── Navbar.js             # Global navigation bar with lang switcher
        │   ├── ProtectedRoute.js     # Auth route guard
        │   ├── VoiceCommand.js       # Web Speech API voice assistant
        │   └── WorkerCard.js         # Worker profile summary card
        ├── context/
        │   ├── AuthContext.js        # User session & authentication state
        │   └── LanguageContext.js    # Bilingual English/Hindi state
        ├── pages/
        │   ├── HomePage.js           # Landing page with hero & quick search
        │   ├── SearchPage.js         # Filterable worker catalog
        │   ├── WorkerDetailPage.js   # Detailed worker view & booking form
        │   ├── JobsPage.js           # Job board
        │   ├── PostJobPage.js        # New job creation form
        │   ├── BulkHirePage.js       # Enterprise bulk hiring interface
        │   ├── DashboardPage.js      # User management dashboard
        │   ├── WorkerProfileSetup.js # Worker profile onboarding
        │   ├── LoginPage.js          # User sign-in
        │   └── RegisterPage.js       # User registration
        ├── App.js                    # Application routes and providers
        ├── App.css                   # Global styles and design system
        └── index.js                  # React DOM mount point
```

---

## ⚙️ Prerequisites

Before running the application locally, ensure you have the following installed:

- **Node.js**: v16.x or higher (v18+ recommended)
- **npm**: v8.x or higher
- **MongoDB**: A running local MongoDB instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- **Git**: Installed and configured on your machine

---

## 🚀 Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/vishaldhakad99/RozgaarX.git
cd RozgaarX
```

### 2. Quick Start (Monorepo Helper)

You can install all dependencies from the root directory:

```bash
# Install dependencies for both backend and frontend
npm run install-all
```

Then run the services in separate terminals:

```bash
# Terminal 1: Start backend server
npm run dev-backend

# Terminal 2: Start frontend development server
npm run dev-frontend
```

---

### 3. Manual Setup (Backend & Frontend)

#### Step 3A: Backend Configuration

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Open `backend/.env` and configure your credentials:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/rozgaarx?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Start the backend server:
```bash
npm run dev
# Server will start on http://localhost:5000
```

#### Step 3B: Frontend Configuration

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Ensure `frontend/.env` contains:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=RozgaarX
```

Start the React development server:
```bash
npm start
# App will open automatically at http://localhost:3000
```

---

## 🔐 Environment Configuration

### Backend (`backend/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port number for Express server | `5000` |
| `MONGODB_URI` | MongoDB connection URI | `mongodb://localhost:27017/rozgaarx` |
| `JWT_SECRET` | Secret key used for signing JWT tokens | `your_secret_key` |
| `NODE_ENV` | Environment mode (`development` / `production`) | `development` |
| `FRONTEND_URL` | Allowed origin for CORS | `http://localhost:3000` |

### Frontend (`frontend/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `REACT_APP_APP_NAME`| Application display title | `RozgaarX` |

---

## 📡 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new user (worker/employer/company) | No |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT | No |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | Yes |

### Workers (`/api/workers`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/workers` | Search workers with `skill` and `city` query filters | No |
| `GET` | `/api/workers/:id` | Fetch detailed worker profile | No |
| `POST` | `/api/workers/profile` | Create new worker profile | Yes |
| `PUT` | `/api/workers/profile` | Update existing worker profile | Yes |
| `PUT` | `/api/workers/toggle-availability` | Toggle availability status | Yes |

### Jobs (`/api/jobs`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/jobs` | Retrieve all open job listings | No |
| `POST` | `/api/jobs` | Post a new job | Yes |
| `GET` | `/api/jobs/my` | Retrieve jobs posted by the authenticated user | Yes |
| `POST` | `/api/jobs/:id/apply` | Apply to a job posting | Yes |

### Bookings (`/api/bookings`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/bookings` | Create a new direct worker booking | Yes |
| `GET` | `/api/bookings/my` | Retrieve bookings for current user/worker | Yes |
| `PUT` | `/api/bookings/:id/status` | Update booking status (`pending`, `confirmed`, `completed`, `cancelled`) | Yes |

### Reviews (`/api/reviews`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/reviews` | Submit a review and rating for a worker | Yes |
| `GET` | `/api/reviews/worker/:id`| Fetch all reviews for a specific worker | No |

### Bulk Hiring (`/api/bulk`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/bulk/search` | Quick search for large worker cohorts | Yes |
| `POST` | `/api/bulk/hire` | Submit a bulk hiring request | Yes |
| `POST` | `/api/bulk/confirm` | Confirm bulk hiring booking | Yes |

---

## 🎤 Voice Commands Guide

RozgaarX includes built-in speech recognition for natural Hindi and English commands:

| Voice Query | Target Action |
| :--- | :--- |
| `"Plumber khojo Delhi mein"` | Searches plumbers in Delhi |
| `"Find electrician Mumbai"` | Searches electricians in Mumbai |
| `"Housekeeping chahiye Pune mein"` | Searches housekeeping staff in Pune |
| `"Kaam post karo"` / `"Post a job"` | Navigates to Job Posting page |
| `"Bulk hire"` / `"Bahut saare workers"` | Navigates to Bulk Hiring page |
| `"Mera dashboard"` / `"My dashboard"` | Navigates to User Dashboard |
| `"Kaam dhundho"` / `"Jobs"` | Navigates to Jobs list page |

---

## 🌐 Deployment Guide

### Backend on Render.com
1. Connect your GitHub repository to [Render](https://render.com/).
2. Create a **New Web Service** pointing to the repository.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Set Environment Variables:
   - `MONGODB_URI` = your production MongoDB Atlas connection string
   - `JWT_SECRET` = your production JWT secret
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = your deployed frontend URL (e.g., `https://rozgaarx.vercel.app`)

### Frontend on Vercel
1. Import the repository on [Vercel](https://vercel.com/).
2. Configure settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Create React App`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
3. Set Environment Variable:
   - `REACT_APP_API_URL` = `https://<your-backend-service>.onrender.com/api`

---

## 🔮 Future Roadmap

- [ ] **OTP-Based Authentication**: Seamless mobile number login via SMS/WhatsApp OTP.
- [ ] **Aadhaar / ID Verification**: Government ID verification for verified worker badges.
- [ ] **In-App Direct Chat**: Real-time WebSockets communication between employers and workers.
- [ ] **Digital Payments & Escrow**: Secure payments via Razorpay / UPI with milestone release.
- [ ] **Geo-Location & Map View**: Interactive map clustering using Google Maps or Leaflet.
- [ ] **Cross-Platform Mobile App**: React Native build for Android and iOS.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit Your Changes**:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. **Push to Your Branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request** targeting the `main` branch.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

**Made with ❤️ for empowering skilled workers across India.**
