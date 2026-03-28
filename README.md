# JobVerse

A modern full-stack job portal that allows users to apply for jobs, recruiters to post jobs, and admins to manage the platform.

---

## 🚀 Features

* User Registration & Login
* Role-based Authentication (Student / Recruiter / Admin)
* Job Posting & Management
* Apply for Jobs
* Profile & Resume Upload
* Cloudinary Image Upload (Optional)
* Responsive and Interactive UI

---

## 🛠 Tech Stack

### Frontend:

* React.js
* Vite
* Tailwind CSS
* Redux Toolkit

### Backend:

* Node.js
* Express.js
* MySQL
* JWT Authentication
* Multer
* Cloudinary

---

## ⚙️ How to Run Locally

Clone the repository:

```bash id="yebav2"
git clone https://github.com/YashMehra15/JobVerse.git
```

Navigate to project folder:

```bash id="3zlbp3"
cd JobVerse
```

Install dependencies:

```bash id="84xtnj"
npm install
```

Create `.env` file in root:

```env id="hl2crh"
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=jobverse

PORT=3000
SECRET_KEY=your_secret_key

CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret
```

Create `frontend/.env`:

```env id="ngixz1"
VITE_API_URL=http://localhost:3000
```

Run backend:

```bash id="3qqsjz"
npm run dev
```

Run frontend:

```bash id="31c1hh"
cd frontend
npm install
npm run dev
```

🌐 Local Development URLs
Frontend → http://localhost:5173
Backend → http://localhost:3000

---

## 🎯 Purpose

This project demonstrates a complete job portal system with authentication, job management, and real-world backend integration.

---

## 👨‍💻 Developed by

Yash Mehra


⭐ Support

If you like this project, give it a ⭐ on GitHub and share it!