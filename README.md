# Goldy Lokhande — Portfolio (MERN)

Full MERN portfolio site: React + Vite frontend, Express + MongoDB backend,
Gmail SMTP contact form, and a `/admin` panel (JWT-protected) to edit every
section without touching code.

```
portfolio/
├── client/     React + Vite frontend
└── server/     Express API (auth, content CMS, contact form)
```

## 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Fill in `.env`:

- `MONGO_URI` — local Mongo (`mongodb://127.0.0.1:27017/goldy-portfolio`) or a free
  [MongoDB Atlas](https://www.mongodb.com/atlas) cluster connection string.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — your `/admin` login. Use a strong password.
- `JWT_SECRET` — any long random string.
- `SMTP_USER` — your Gmail address (`goldylokhande12@gmail.com`).
- `SMTP_PASS` — a Gmail **App Password**, not your normal password:
  1. Turn on 2-Step Verification on your Google Account.
  2. Go to Google Account → Security → App passwords.
  3. Generate one for "Mail", copy the 16-character code into `SMTP_PASS`.
- `CONTACT_RECEIVER` — where contact-form emails should land (defaults to `SMTP_USER`).

Seed the database with your real resume/profile content, then start the API:

```bash
npm run seed   # loads data/seed.js into MongoDB (safe to re-run)
npm run dev    # http://localhost:5000
```

## 2. Frontend setup

```bash
cd client
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api
npm run dev             # http://localhost:5173
```

The site renders from the API once it's reachable. If the API isn't running
yet, it falls back to `src/data/portfolioData.js`, which already has your
real resume content — so the site never shows placeholder text.

## 3. Using the admin panel

Visit `/admin`, sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`. From there you can:

- Edit hero (name, rotating role titles, tagline, avatar image, resume link).
- Edit the about bio, personal photo, location.
- Edit contact email/phone.
- Edit skills, journey/experience, projects, certifications, achievements and
  platform links as JSON (array-shaped sections) — image fields inside these
  accept either an image URL or an uploaded file (stored as base64).

Changes save straight to MongoDB via the protected `PUT /api/content` route
and appear on the live site immediately.

## 4. Adding your photos

Two spots are built to hold your images and are empty by default so nothing
fake ever displays:

- **Hero avatar** — square headshot, shown top-right of the hero section.
- **About photo** — portrait image, shown in the About section.

Add both from `/admin` (upload a file or paste a hosted image URL). Project
cards also have an optional `image` field per project if you want screenshots.

## 5. Deploying

- **Frontend**: Vercel / Netlify — build command `npm run build`, output `dist/`.
  Set `VITE_API_URL` to your deployed API URL.
- **Backend**: Render / Railway / a small VPS — set the same env vars as
  `.env.example`. Point `CLIENT_URL` at your deployed frontend domain (used
  for CORS).
- **Database**: MongoDB Atlas free tier works fine for a single-document CMS
  like this.

## Stack

- **Frontend**: React 18, Vite, Framer Motion (entrance reveals, loader,
  micro-interactions), custom scroll-reveal hook, CSS-only parallax + 3D tilt
  on project cards, `lucide-react` icons.
- **Backend**: Express, Mongoose, JWT auth, `express-rate-limit` on the login
  and contact routes, Nodemailer over Gmail SMTP.
- **Data**: one `Content` document powers the whole site; `Message` stores
  every contact-form submission as a backup even when email delivery is fine.
