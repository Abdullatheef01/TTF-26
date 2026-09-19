# Titan Tech Fest 2026

Official symposium website for the Department of Computer Science and Engineering. It showcases the fest, its events and live schedule, and handles participant registration end to end. The whole site follows an anime / Titan theme with a deep navy and gold look.

---

## Features

**Public website**
- Single-page layout with Home, About, Events, Schedule, Register and Contact sections
- Animated navbar with smooth scrolling to each section
- Sticky hero section with scroll-based fade transitions, character slide-ins and gold gradient headings
- Scroll-reveal animations and 3D elements built with Three.js

**Events**
- Auto-scrolling tilted poster wall with all 10 events
- Event details popup: category, team size, rounds, timing and rules, with previous / next navigation
- Events grouped into four categories: Technical, Semi-Technical, Esports and Non-Technical
- Fully responsive popup (poster fills the card on mobile, constant popup size on desktop)

**Live event timeline**
- Zigzag timeline with a colourful dotted wave line
- Real-time status: events that have started are highlighted, upcoming events stay dimmed
- Time is refreshed automatically, no page reload needed
- Clicking an event opens the same details popup as the poster wall

**Registration**
- 5-step registration form: Basic Info, Event Count, Events, Team, Payment
- Validation on every step with clear error messages
- Two packages (see the table below), with the number of selectable events enforced
- Team step appears only when a team event is selected
- Payment step with QR code, transaction / UPI ID and payment screenshot upload
- A unique registration ID (`REG-XXXXXX`) is generated on submit
- Registrations are stored in Firebase Firestore

**Security**
- Firebase App Check with reCAPTCHA Enterprise (invisible bot protection for Firestore)
- Visible reCAPTCHA v2 checkbox ("I'm not a robot") on the final registration step

**Admin**
- Password-protected `/admin` route to view and manage registrations

---

## Events

| Event | Theme name | Category |
| --- | --- | --- |
| Paper Presentation | Assassin Scholars | Technical |
| Web Design | Digital Espadas | Technical |
| SQL Query | Data Slayer | Technical |
| Tech Quiz | Aizen IQ Arena | Technical |
| Tech Treasure Hunt | One Piece Quest | Semi-Technical |
| Logo Identification | Six Eye Challenge | Semi-Technical |
| Free Fire | Akatsuki Royale | Esports |
| Chess | Lelouch Strategy Arena | Esports |
| Vision Void | Sharingan Challenge | Non-Technical |
| Minute to Win It | One Minute Hero | Non-Technical |

## Registration Packages

| Package | Events included | Fee |
| --- | --- | --- |
| Standard | 4 events | ₹200 |
| Premium | 5 events | ₹250 |

---

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React, Vite |
| Styling | Tailwind CSS |
| 3D / Animation | Three.js, React Three Fiber |
| Database and Auth | Firebase (Firestore, Authentication) |
| Bot protection | Firebase App Check (reCAPTCHA Enterprise), Google reCAPTCHA v2 |
| Hosting | Vercel |

---

## Project Structure

```
src/
├── assets/                 # Event poster images
├── components/
│   ├── Event.jsx           # Poster wall + reusable EventModal
│   ├── EventTimeline.jsx   # Real-time event timeline
│   ├── Hero.jsx
│   └── Footer.jsx
├── pages/
│   └── Register.jsx        # 5-step registration form
└── firebase.js             # Firebase and App Check setup
```

---

## Getting Started

### Prerequisites
- Node.js 18 or later
- A Firebase project with Firestore and Authentication enabled
- reCAPTCHA keys (see below)

### Installation

```bash
git clone https://github.com/Abdullatheef01/TTF'26.git
cd TTF'26
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# reCAPTCHA Enterprise site key (used by Firebase App Check)
VITE_RECAPTCHA_SITE_KEY=

# reCAPTCHA v2 checkbox site key (used on the registration page)
VITE_RECAPTCHA_V2_SITE_KEY=
```

> Never commit the `.env` file. Make sure it is listed in `.gitignore`.

### Run locally

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

---

## Security Setup

**1. App Check (reCAPTCHA Enterprise)**
1. In the Firebase console go to Security, then App Check, then Apps.
2. Register the web app with the reCAPTCHA Enterprise provider and add the site key.
3. Add `localhost` and the production domain to the key's allowed domains.

**2. Local development**
- In development mode the app uses an App Check debug token.
- Open the browser console, copy the printed debug token and register it under App Check, Apps, Manage debug tokens.

**3. Registration checkbox (reCAPTCHA v2)**
- Create a v2 "I'm not a robot" key at `google.com/recaptcha/admin`.
- Add `localhost` and the production domain (host only, no protocol or port).

**4. Enforcement**
- Deploy the site first, confirm that requests show as verified, then enable **Enforce** for Cloud Firestore under App Check, APIs.
- Enforcing before deployment will block registrations.

---

## Deployment (Vercel)

1. Import the repository into Vercel.
2. Add all variables from the `.env` file under Settings, Environment Variables.
3. Deploy. Every push to `main` triggers an automatic deployment.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |

---

## Testing the Live Timeline

The timeline follows the device clock. To preview a specific time, set the test value at the top of `src/components/EventTimeline.jsx`:

```js
const TEST_TIME = '11:15 AM'; // set back to null for real time
```

---

## Offical Page
**Click to Register The Fest:** https://ttf-26.vercel.app/
## Roadmap

- Automated confirmation email containing the registration ID

---

## Contributors

- [Abdul Latheef J](https://github.com/Abdullatheef01)
- [LakshayAseri](https://github.com/LakshayAseri)
- [Yamuna1230](https://github.com/Yamuna1230)
