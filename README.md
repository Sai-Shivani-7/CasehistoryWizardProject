# CaseHistory Wizard — Full Stack

Paediatric therapy case-history management app.  
**Stack:** React + Vite (frontend) · Express + Mongoose (backend) · MongoDB (local)

---

## Project Layout

```
CaseHistoryWizard/
├── frontend/          ← React + Vite app
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── Pages/Doctor/CaseHistory/
│   │       ├── CaseHistoryWizard.jsx   ← main wizard
│   │       ├── Step1Demographics.jsx
│   │       ├── Step2DocumentsChecklist.jsx
│   │       ├── Step3IncreasingBehaviour.jsx
│   │       ├── Step4DecreasingBehaviour.jsx
│   │       ├── Step5TrialExamination.jsx
│   │       ├── Step6ScreeningDrawingTest.jsx
│   │       ├── Step7AssessmentNotes.jsx
│   │       ├── Step8MedicalHistoryForm.jsx
│   │       └── DrawingCanvas.jsx
│   ├── vite.config.js              ← proxy /api → localhost:5000
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── package.json
│
└── backend/           ← Express API
    ├── server.js
    ├── seed.js                     ← run once to add sample data
    ├── .env.example
    ├── package.json
    ├── models/
    │   ├── Centre.js               → collection: centres
    │   ├── Therapist.js            → collection: therapists
    │   ├── Child.js                → collection: children
    │   └── Case.js                 → collection: cases
    └── routes/
        ├── centre.routes.js        → /api/centres
        ├── therapist.routes.js     → /api/therapists
        ├── child.routes.js         → /api/children
        └── case.routes.js          → /api/cases
```

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 18 + | https://nodejs.org |
| MongoDB Community | 6 + | https://www.mongodb.com/try/download/community |
| npm | 9 + | bundled with Node |

Make sure MongoDB is **running locally** before starting the backend.  
On most systems: `mongod` or via the MongoDB Compass GUI.

---

## Setup — Step by Step

### 1 — Install backend dependencies

```bash
cd backend
npm install
```

### 2 — Configure backend environment

```bash
cp .env.example .env
```

`.env` contents (defaults work for local MongoDB out of the box):

```env
MONGO_URI=mongodb://127.0.0.1:27017/casehistorywizard
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 3 — Seed sample data

This creates **2 centres, 3 therapists and 8 children** so the child dropdown is populated immediately:

```bash
npm run seed
```

Expected output:
```
✅  Connected to MongoDB
🗑️   Cleared centres, therapists, children
🏢  Centres seeded: Total Solutions – Hyderabad | Total Solutions – Secunderabad
👩‍⚕️  Therapists seeded: Dr. Tejesh Kumar | Dr. Sravani Reddy | Dr. Anand Prasad
👶  8 children seeded
✅  Seeding complete!
```

### 4 — Start the backend

```bash
npm run dev
```

Server runs at **http://localhost:5000**

### 5 — Install frontend dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### 6 — Start the frontend

```bash
npm run dev
```

App runs at **http://localhost:5173**

---

## How It Works

```
Browser (localhost:5173)
        │
        │  GET /api/children          ← child dropdown
        │  GET /api/cases/child/:id   ← load past histories
        │  POST /api/cases            ← Save button (all 8 steps)
        │
   Vite proxy (/api → localhost:5000)
        │
   Express (localhost:5000)
        │
   MongoDB (localhost:27017)
        ├── casehistorywizard.centres
        ├── casehistorywizard.therapists
        ├── casehistorywizard.children
        └── casehistorywizard.cases
```

The Vite proxy in `vite.config.js` forwards every `/api/*` request from the
frontend to the backend — no CORS issues, no URL changes needed between dev
and production.

---

## API Reference

### Children
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/children` | List all active children (used by dropdown) |
| POST | `/api/children` | Create a child |
| GET | `/api/children/:id` | Single child |
| PUT | `/api/children/:id` | Update child |
| DELETE | `/api/children/:id` | Soft-delete child |

### Cases
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/cases` | Save full wizard (all 8 steps) |
| GET | `/api/cases/child/:childId` | All past cases for a child |
| GET | `/api/cases/:id` | Single case by ID |
| PUT | `/api/cases/:id` | Update a case |
| DELETE | `/api/cases/:id` | Delete a case |
| GET | `/api/cases` | All cases paginated (admin) |

### Therapists
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/therapists` | List all therapists |
| POST | `/api/therapists` | Create therapist |
| PUT | `/api/therapists/:id` | Update therapist |
| DELETE | `/api/therapists/:id` | Delete therapist |

### Centres
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/centres` | List all centres |
| POST | `/api/centres` | Create centre |
| PUT | `/api/centres/:id` | Update centre |
| DELETE | `/api/centres/:id` | Delete centre |

---

## Adding a New Child via API (curl)

```bash
# First get a therapist and centre ID from the seed data:
curl http://localhost:5000/api/therapists
curl http://localhost:5000/api/centres

# Create child (replace IDs with real ones from above):
curl -X POST http://localhost:5000/api/children \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Child",
    "dob": "2020-01-15",
    "gender": "Male",
    "therapistId": "<therapist_id>",
    "centreId": "<centre_id>"
  }'
```

---

## MongoDB Collections

Open **MongoDB Compass** and connect to `mongodb://localhost:27017` to browse:

- `casehistorywizard.centres` — therapy centres
- `casehistorywizard.therapists` — therapist profiles
- `casehistorywizard.children` — patient records
- `casehistorywizard.cases` — full 8-step case history documents

---

## Workflow

1. **Seed** the DB once (`npm run seed`)
2. Open the frontend at `http://localhost:5173`
3. **Search and select** a child from the dropdown
4. Fill in all 8 steps of the wizard
5. Click **Save** on step 8 — the full record is stored in `cases`
6. Past histories appear in the table above the wizard; click **View** to reload or **PDF** to download
