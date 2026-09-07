# 🚀 GEN Z VOICES — MASTER RESEARCH ECOSYSTEM

> **Tagline:** *"Your Perspective. A Brighter Tomorrow."*

Gen Z Voices is a large-scale, research-driven digital platform designed to understand the behavior, lifestyle, aspirations, values, preferences, and future perspectives of Generation Z in India.

---

## 🎨 Official Brand Design System

- **Primary Azure Blue:** `#265AFC` (Trust, Technology, Innovation)
- **Secondary Sunglow Yellow:** `#FFDA38` (Youth, Optimism, Energy)
- **Supporting Deep Navy:** `#0B1F3A` (Authority, Research Credibility)
- **Soft Background:** `#F7F9FC`
- **White:** `#FFFFFF`

---

## 🏗️ Architecture & Stack

### Frontend Architecture
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS v3 + Custom Design Tokens
- **Animations:** GSAP + Canvas Confetti
- **State Management:** Zustand (Optimized selectors for granular re-rendering)
- **Offline Persistence:** Dexie.js (IndexedDB local save & background sync queue)
- **Visualizations:** Recharts
- **Icons:** Lucide React

### Backend Architecture
- **Framework:** FastAPI (Python 3.11+)
- **Analytics:** NumPy, Pandas, Scikit-Learn
- **Certificate Engine:** ReportLab PDF Generator
- **Security & Integrity:** Data Quality Engine (Straight-lining detection), Fraud & Risk Scoring Engine

### Database Architecture
- **Platform:** Supabase PostgreSQL
- **Security:** Strict Row Level Security (RLS) policies
- **Privacy:** Isolation layer separating PDI (`participant_identities`) from anonymous research responses (`anonymous_participants` / `survey_responses`)

---

## 📁 Directory Structure

```text
gen-z-voices/
├── frontend/             # React 18 + Vite + Tailwind CSS + Zustand
│   ├── src/
│   │   ├── components/   # Common, Layout, Landing, Survey, Dashboard, Analytics
│   │   ├── pages/        # Home, Survey, SurveyComplete, VerifyCertificate, Admin, Analytics
│   │   ├── services/     # db (IndexedDB), supabaseClient, syncService
│   │   └── stores/       # surveyStore (Zustand state)
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/              # FastAPI Intelligence Engine
│   ├── main.py
│   ├── services/         # quality_engine, fraud_engine, analytics_engine, certificate_service
│   └── requirements.txt
├── supabase/             # Database Schemas & RLS
│   ├── migrations/       # 20260905000000_initial_schema.sql
│   ├── rls_policies.sql
│   └── seed.sql
└── README.md
```

---

## 🚀 Running the Application

### 1. Frontend Development Server
```bash
cd frontend
cmd /c npm install
cmd /c npm run dev
```
Access at: `http://localhost:3000`

### 2. Backend FastAPI Intelligence Server
```bash
cd backend
pip install -r requirements.txt
python main.py
```
API Documentation available at: `http://localhost:8000/docs`

---

## 🔒 Privacy & Research Integrity

- **Decoupled PDI:** Participant Identity information is stored separately from survey answers.
- **Autosave & Offline Resilience:** Answers write to local IndexedDB first, ensuring zero lost progress during network drops.
- **Data Quality Score (0-100):** Automated check for straight-lining, velocity anomalies, missing data, and attention validation.
