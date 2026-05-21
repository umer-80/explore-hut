# 🏠 Explore Hut - MERN Stack Application

A full-stack property listing and review platform built with MongoDB, Express, React, and Node.js.

## ✨ Features

- 🔐 User Authentication (JWT-based)
- 🏡 Create, Read, Update, Delete Listings
- ⭐ Review and Rating System
- 📸 Image Upload with Cloudinary
- 🔒 Protected Routes & Authorization
- 📱 Responsive Design
- 🎨 Modern UI/UX

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (Image Storage)
- Multer (File Upload)
- Joi (Validation)

### Frontend
- React 18
- React Router v6
- Axios
- React Toastify
- Context API (State Management)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account

## 🚀 Installation & Setup

### 1. Clone the repository
\`\`\`bash
git clone <your-repo-url>
cd ExploreHut
\`\`\`

### 2. Backend Setup

\`\`\`bash
cd backend
npm install
\`\`\`

The `.env` file is already configured with your credentials. If you need to update:

\`\`\`env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
\`\`\`

### 3. Frontend Setup

\`\`\`bash
cd ../frontend
npm install
\`\`\`

### 4. Run the Application

**Terminal 1 - Backend:**
\`\`\`bash
cd backend
npm run dev
# Server runs on http://localhost:5000
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`bash
cd frontend
npm start
# React app runs on http://localhost:3000
\`\`\`

### 5. Access the Application

Open your browser and navigate to: **http://localhost:3000**

## 📁 Project Structure

\`\`\`
ExploreHut/
├── backend/
│   ├── config/
│   │   └── cloudinary.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Listing.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── listings.js
│   │   └── reviews.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── ListingDetails.js
│   │   │   ├── CreateListing.js
│   │   │   └── EditListing.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
\`\`\`

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Listings
- `GET /api/listings` - Get all listings
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing (Protected)
- `PUT /api/listings/:id` - Update listing (Protected, Owner only)
- `DELETE /api/listings/:id` - Delete listing (Protected, Owner only)

### Reviews
- `POST /api/reviews/:listingId` - Add review (Protected)
- `DELETE /api/reviews/:reviewId` - Delete review (Protected, Author only)

## 🎯 Usage

1. **Sign Up**: Create a new account
2. **Login**: Access your account
3. **Browse Listings**: View all available properties
4. **Create Listing**: Add your own property (requires login)
5. **Add Reviews**: Leave reviews on listings (requires login)
6. **Manage**: Edit or delete your own listings and reviews

## 🌐 Deployment

### Backend (Render/Railway/Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Update API URL in frontend
4. Deploy

## 📝 Notes

- The backend runs on port 5000
- The frontend runs on port 3000
- Frontend proxies API requests to backend during development
- All passwords are hashed using bcrypt
- JWT tokens expire in 7 days
- Images are stored on Cloudinary

## 👨‍💻 Author

**Sarvesh Devrukhkar**

## 📄 License

ISC

---

**Happy Coding! 🚀**
