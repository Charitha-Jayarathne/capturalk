# CapturaLK Backend API 📸

A production-ready Express & Node.js backend for the CapturaLK Photography & Cinematography platform with MongoDB Atlas integration and Cloudinary media cloud storage.

---

## 🛠️ Tech Stack & Features
- **Runtime:** Node.js (ES Modules `import/export`)
- **Web Framework:** Express.js 4
- **Database:** MongoDB Atlas via Mongoose ODM
- **Media Storage:** Cloudinary via Multer memory streaming (no temp disk files)
- **Security:** JWT authentication, bcryptjs password hashing, CORS protection
- **DNS Resilience:** Embedded Google DNS resolver (8.8.8.8) to handle MongoDB Atlas SRV records smoothly on Windows/ISP networks

---

## 📁 Project Architecture
```
backend/
├── .env                  # Live environment variables (MongoDB, Cloudinary, JWT)
├── .env.example          # Environment variables template
├── .gitignore            # Excludes node_modules, .env, logs
├── package.json          # Dependencies & scripts
└── src/
    ├── config/
    │   ├── db.js          # MongoDB Atlas connection & event listeners
    │   └── cloudinary.js  # Cloudinary SDK config & streaming upload helper
    ├── controllers/
    │   ├── authController.js       # Admin registration, login, and JWT tokens
    │   ├── bookingController.js    # Client booking inquiries CRUD
    │   ├── portfolioController.js  # Gallery items CRUD with image upload
    │   └── uploadController.js     # Direct media upload to Cloudinary
    ├── middleware/
    │   ├── authMiddleware.js       # JWT protect & admin-only guards
    │   ├── errorMiddleware.js      # Centralized 404 & error handlers
    │   └── uploadMiddleware.js     # Multer memory storage & MIME filters
    ├── models/
    │   ├── Booking.js    # Client date reservation inquiry schema
    │   ├── Portfolio.js  # Portfolio showcase schema with Cloudinary metadata
    │   └── User.js       # Studio admin schema with bcrypt hashing
    ├── routes/
    │   ├── authRoutes.js       # /api/auth
    │   ├── bookingRoutes.js    # /api/bookings
    │   ├── healthRoutes.js     # /api/health
    │   ├── portfolioRoutes.js  # /api/portfolio
    │   └── uploadRoutes.js     # /api/upload
    ├── utils/
    │   └── testConnections.js  # Instant connection test CLI script
    └── server.js               # Central server entry point
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment (`.env`)
The `.env` file is already created with your credentials:
```env
PORT=5000
MONGODB_USERNAME=jayarathnacharitha5_db_user
MONGODB_PASSWORD=5a6TjtgwWQXfwzFJ
MONGODB_URI=mongodb+srv://jayarathnacharitha5_db_user:5a6TjtgwWQXfwzFJ@cluster0.wz1ijx2.mongodb.net/capturalk?retryWrites=true&w=majority&appName=Cluster0

CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=647995373355393
CLOUDINARY_API_SECRET=eBs1tteDc9_6kqzfZRKT73ulhl8

JWT_SECRET=captura_secret_key_super_secure_jwt_2026_lk
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

> **Important Cloudinary Note:** 
> Enter your exact **Cloud Name** (found in your Cloudinary Dashboard under *Account Details*) in `CLOUDINARY_CLOUD_NAME` in `backend/.env`.

---

### 3. Run Connection Test
Verify MongoDB and Cloudinary connections at any time:
```bash
npm run test-connections
```

### 4. Start the Server
```bash
# Development mode with hot-reloading
npm run dev

# Production mode
npm start
```

---

## 📡 Key API Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/` | API Root status & directory | Public |
| `GET` | `/api/health` | Live health check (MongoDB & Cloudinary status) | Public |
| `POST` | `/api/bookings` | Submit booking inquiry from frontend modal | Public |
| `GET` | `/api/bookings` | Retrieve all booking inquiries | Admin |
| `PATCH`| `/api/bookings/:id/status`| Update booking status (pending/confirmed/etc.) | Admin |
| `GET` | `/api/portfolio` | Retrieve showcase portfolio items | Public |
| `POST` | `/api/portfolio` | Add new portfolio item (multipart image) | Admin |
| `POST` | `/api/upload` | Direct image upload to Cloudinary | Admin |
| `POST` | `/api/auth/register` | Register admin/user account | Public |
| `POST` | `/api/auth/login` | Login and receive JWT access token | Public |
