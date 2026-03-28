# JobVerse — Upgraded & Fixed

A modern full-stack job portal built with **React**, **Node.js**, **MySQL**, and **Cloudinary**.

---

## 🐛 Bugs Fixed

### 1. Registration Always Failing (Primary Fix)

**Root cause:** `frontend/src/utils/constant.js` was hardcoded to a deployed Render URL (`https://jobverse-x783.onrender.com`) that is either down or misconfigured. All API calls—including registration—were going to a dead server.

**Fix:** `constant.js` now reads from `VITE_API_URL` environment variable and defaults to `http://localhost:3000` for local development.

```js
// Before (broken)
export const USER_API_END_POINT = "https://jobverse-x783.onrender.com/api/v1/user";

// After (fixed)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const USER_API_END_POINT = `${BASE_URL}/api/v1/user`;
```

### 2. UUID / Database Insert Error

**Root cause:** The database schema used `DEFAULT (UUID())` which requires **MySQL 8.0.13+**. On older MySQL versions, this silently fails causing all INSERT operations to error.

**Fix:** Removed `DEFAULT (UUID())` from schema. All controllers now use the `uuid` npm package to generate IDs before inserting:

```js
import { v4 as uuidv4 } from "uuid";
const newId = uuidv4();
await pool.execute("INSERT INTO users (id, ...) VALUES (?, ...)", [newId, ...]);
```

### 3. Photo Upload Blocking Registration

**Root cause:** If Cloudinary credentials are not set or the upload fails, the entire registration would crash with a 500 error instead of registering without a photo.

**Fix:** Photo upload is now wrapped in a try/catch. If it fails, registration proceeds without a photo (non-blocking):

```js
if (file) {
  try {
    const cloudResponse = await cloudinary.uploader.upload(...);
    profilePhotoUrl = cloudResponse.secure_url;
  } catch (uploadErr) {
    console.warn("Profile photo upload skipped:", uploadErr.message);
    // Registration continues without photo
  }
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 5.7+ (or MySQL 8+)
- Cloudinary account (optional for photo uploads)

### 1. Clone & Install

```bash
npm install          # installs root dependencies (uuid added)
```

### 2. Set Environment Variables

Create `.env` in the root directory:

```env
# MySQL Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=jobverse

# App
PORT=3000
SECRET_KEY=your_super_secret_jwt_key_here

# Cloudinary (optional - registration works without these)
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

Create `frontend/.env` for the frontend:

```env
VITE_API_URL=http://localhost:3000
```

### 3. Create MySQL Database

```sql
CREATE DATABASE jobverse;
```

Tables are auto-created on first server start.

### 4. Run

```bash
# Development (runs backend + auto-creates tables)
npm run dev

# In another terminal, run frontend
cd frontend && npm install && npm run dev
```

Backend runs on `http://localhost:3000`  
Frontend runs on `http://localhost:5173`

---

## 📦 New Dependencies Added

| Package | Reason |
|---------|--------|
| `uuid` | Generate UUIDs in JS instead of relying on MySQL `DEFAULT (UUID())` |

---

## ✨ UI Improvements

- **New font system:** Cabinet Grotesk (headings) + Satoshi (body) — premium feel
- **Redesigned auth pages:** Split-panel login, role-card selection with checkmarks, password visibility toggle
- **Animated hero section:** Mesh gradient background, dot grid, staggered fade-up animations
- **Revamped job cards:** Hover accent line, colored type badges, better typography
- **Category grid:** 8-category icon grid replacing the basic carousel
- **Improved navbar:** Scroll-aware styling, cleaner user popover
- **Dark footer:** Deep navy gradient with subtle glow effects
- **Micro-interactions:** card-lift on hover, pulse animations, smooth transitions throughout

---

## 🏗 Tech Stack

- **Frontend:** React 18, Vite, TailwindCSS, Redux Toolkit, Axios
- **Backend:** Node.js, Express, MySQL2, bcryptjs, JWT, Multer, Cloudinary
- **Database:** MySQL with auto-migration on startup
