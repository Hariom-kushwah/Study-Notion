# StudyNotion Edtech Project
# 🎓 StudyNotion - MERN Ed-Tech Platform

> A full-stack Ed-Tech platform that enables students to discover, purchase, and learn from online courses while allowing instructors to create and manage educational content.

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Full%20Stack-green?style=for-the-badge">
  <img src="https://img.shields.io/badge/React-Frontend-blue?style=for-the-badge">
  <img src="https://img.shields.io/badge/Node.js-Backend-success?style=for-the-badge">
  <img src="https://img.shields.io/badge/MongoDB-Database-brightgreen?style=for-the-badge">
  <img src="https://img.shields.io/badge/License-MIT-orange?style=for-the-badge">
</p>

---

# 📖 Overview

StudyNotion is a complete Learning Management System (LMS) developed using the MERN Stack.

The platform provides a seamless experience for both students and instructors.

Students can browse, purchase, and consume courses, while instructors can create, manage, and publish educational content through an intuitive dashboard.

The application follows a Client-Server Architecture and is built using modern web technologies with secure authentication, cloud media storage, and online payment integration.

---

# 🚀 Live Demo

### 🌐 Frontend
https://your-frontend.vercel.app

### ⚙️ Backend API
https://your-backend.onrender.com

---

# 📸 Screenshots

## Home Page

![Home](screenshots/home.png)

## Student Dashboard

![Dashboard](screenshots/dashboard.png)

## Instructor Dashboard

![Instructor](screenshots/instructor-dashboard.png)

## Course Player

![Course Player](screenshots/course-player.png)

---

# ✨ Features

## 👨‍🎓 Student Features

- User Registration
- Login & Authentication
- Email OTP Verification
- Forgot Password
- Browse Courses
- Search Courses
- Course Categories
- Wishlist
- Shopping Cart
- Razorpay Payment
- Course Enrollment
- Watch Video Lectures
- Download Resources
- Course Progress Tracking
- Rate & Review Courses
- Profile Management

---

## 👨‍🏫 Instructor Features

- Instructor Dashboard
- Create Courses
- Edit Courses
- Delete Courses
- Upload Course Thumbnail
- Upload Videos
- Add Sections & Subsections
- Course Analytics
- Student Enrollment Details
- Revenue Tracking
- Profile Management

---

## 🔒 Security Features

- JWT Authentication
- Role-Based Access Control (RBAC)
- Password Hashing using Bcrypt
- OTP Email Verification
- Forgot Password Flow
- Protected Routes
- Secure REST APIs
- Cookie-based Authentication

---

# 🛠 Tech Stack

## Frontend

- React.js
- Redux Toolkit
- HTML5
- CSS3
- Tailwind CSS
- React Router DOM
- Axios

---

## Backend

- Node.js
- Express.js
- JWT
- Bcrypt
- Nodemailer
- Express Validator

---

## Database

- MongoDB
- Mongoose

---

## Cloud Services

- Cloudinary
- MongoDB Atlas
- Razorpay

---

## Deployment

- Vercel
- Render

---

# 🏗 System Architecture

```
React.js Frontend
        │
 REST API Calls
        │
Node.js + Express.js
        │
MongoDB Database
        │
Cloudinary Storage
        │
Razorpay Payment Gateway
```

---

# 📂 Folder Structure

```
StudyNotion/

├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   └── services/
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── utils/
│
├── screenshots/
│
└── README.md
```

---

# ⚡ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/StudyNotion.git
```

Move to project

```bash
cd StudyNotion
```

---

## Install Frontend

```bash
cd client

npm install
```

---

## Install Backend

```bash
cd server

npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=

MONGODB_URL=

JWT_SECRET=

MAIL_HOST=

MAIL_USER=

MAIL_PASS=

CLOUD_NAME=

API_KEY=

API_SECRET=

FOLDER_NAME=

RAZORPAY_KEY=

RAZORPAY_SECRET=
```

Do not commit `.env` files or paste secret values into GitHub.

## Deploy the backend to Render

This Express backend runs as a long-lived Node.js server, so deploy it as a Render Web Service rather than a Vercel Function.

1. In Render, create a new Blueprint and select this GitHub repository. Render will use `render.yaml` and set the service root to `server`.
2. Add the requested environment variables in Render. Use the same names shown above; Render supplies `PORT` automatically. Use a newly generated Gmail App Password for `MAIL_PASS`.
3. After the service deploys, open its URL. The root page should return a JSON message confirming the server is running.
4. In the Vercel frontend project's Environment Variables, set `REACT_APP_BASE_URL` to the Render service URL followed by `/api/v1` (for example, `https://your-service.onrender.com/api/v1`), then redeploy the frontend.

---

# ▶️ Run Locally

Backend

```bash
npm run dev
```

Frontend

```bash
npm start
```

---

# 📡 API Endpoints

Authentication

```
POST /api/auth/signup

POST /api/auth/login

POST /api/auth/verifyOTP

POST /api/auth/forgot-password
```

Courses

```
GET /api/courses

POST /api/courses

PUT /api/courses/:id

DELETE /api/courses/:id
```

Payments

```
POST /api/payment/capture

POST /api/payment/verify
```

---

# 📊 Database Models

- User
- Profile
- Course
- Category
- Section
- SubSection
- Rating & Review
- Course Progress

---

# 🎯 Key Highlights

✔ MERN Stack Architecture

✔ JWT Authentication

✔ OTP Email Verification

✔ Role-Based Access Control

✔ Razorpay Integration

✔ Cloudinary Media Upload

✔ RESTful APIs

✔ Responsive Design

✔ Redux State Management

✔ Secure Password Hashing

---

# 🚀 Future Enhancements

- Mobile Application
- AI Course Recommendation
- Gamification
- Leaderboards
- Certificates
- Live Classes
- Discussion Forums
- Chat System
- Personalized Learning Paths
- Admin Dashboard

---

# 👨‍💻 Author

**Hariom Kushwah**

📧 Email: hariomkus90@gmail.com

💼 LinkedIn: https://linkedin.com/in/your-profile

💻 GitHub: https://github.com/your-username

---

# ⭐ Support

If you found this project useful,

please ⭐ Star this repository.

It motivates me to build more open-source projects.

---

## 📜 License

This project is licensed under the MIT License.
