# 🏗️ Explore Hut - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                          │
│                    (React Application)                       │
│                   http://localhost:3000                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Navbar     │  │  Auth Pages  │  │   Listings   │      │
│  │  Component   │  │ Login/Signup │  │    Pages     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │           AuthContext (Global State)                │     │
│  │         - User info, Login/Logout methods          │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │              React Router v6                        │     │
│  │    - Public routes (Home, Login, Signup)           │     │
│  │    - Protected routes (Create, Edit)               │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP Requests (Axios)
                        │ JWT Token in Headers
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                       SERVER SIDE                            │
│                  (Express REST API)                          │
│                  http://localhost:5000                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │              API Routes                             │     │
│  │  /api/auth     - Authentication endpoints          │     │
│  │  /api/listings - Listings CRUD operations          │     │
│  │  /api/reviews  - Reviews operations                │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │              Middleware                             │     │
│  │  - JWT Authentication                               │     │
│  │  - Joi Validation                                   │     │
│  │  - Multer File Upload                               │     │
│  │  - Error Handling                                   │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │              Controllers                            │     │
│  │  - Business Logic                                   │     │
│  │  - Request/Response Handling                        │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Mongoose ODM
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                      DATABASE                                │
│                   MongoDB Atlas                              │
│                  (Cloud Database)                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Users     │  │   Listings   │  │   Reviews    │      │
│  │  Collection  │  │  Collection  │  │  Collection  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │              Cloudinary                             │     │
│  │         (Image Storage & CDN)                       │     │
│  │  - Upload images                                    │     │
│  │  - Transform images                                 │     │
│  │  - Deliver via CDN                                  │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Registration Flow
```
User fills signup form
    ↓
React sends POST /api/auth/signup
    ↓
Backend validates data (Joi)
    ↓
Password hashed (bcrypt)
    ↓
User saved to MongoDB
    ↓
JWT token generated
    ↓
Token sent to frontend
    ↓
Token stored in localStorage
    ↓
User redirected to home
```

### 2. Create Listing Flow
```
User fills listing form + uploads image
    ↓
React sends POST /api/listings (multipart/form-data)
    ↓
JWT middleware verifies token
    ↓
Multer processes file upload
    ↓
Image uploaded to Cloudinary
    ↓
Cloudinary returns URL
    ↓
Listing saved to MongoDB with image URL
    ↓
Success response to frontend
    ↓
User redirected to home
```

### 3. Add Review Flow
```
User submits review form
    ↓
React sends POST /api/reviews/:listingId
    ↓
JWT middleware verifies token
    ↓
Joi validates review data
    ↓
Review saved to MongoDB
    ↓
Review ID added to listing's reviews array
    ↓
Review populated with author info
    ↓
Response sent to frontend
    ↓
UI updated with new review
```

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  createdAt: Date,
  updatedAt: Date
}
```

### Listing Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  image: {
    url: String,
    filename: String
  },
  price: Number (required, min: 0),
  location: String (required),
  country: String (required),
  owner: ObjectId (ref: User),
  reviews: [ObjectId] (ref: Review),
  createdAt: Date,
  updatedAt: Date
}
```

### Review Model
```javascript
{
  _id: ObjectId,
  comment: String (required),
  rating: Number (required, 1-5),
  author: ObjectId (ref: User),
  listing: ObjectId (ref: Listing),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | No | Register new user |
| POST | /api/auth/login | No | Login user |
| GET | /api/auth/me | Yes | Get current user |

### Listings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/listings | No | Get all listings |
| GET | /api/listings/:id | No | Get single listing |
| POST | /api/listings | Yes | Create listing |
| PUT | /api/listings/:id | Yes | Update listing (owner) |
| DELETE | /api/listings/:id | Yes | Delete listing (owner) |

### Reviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/reviews/:listingId | Yes | Add review |
| DELETE | /api/reviews/:reviewId | Yes | Delete review (author) |

## Frontend Routes

| Path | Component | Protected | Description |
|------|-----------|-----------|-------------|
| / | Home | No | All listings |
| /login | Login | No | Login form |
| /signup | Signup | No | Registration form |
| /listings/:id | ListingDetails | No | Single listing |
| /create-listing | CreateListing | Yes | Create form |
| /edit-listing/:id | EditListing | Yes | Edit form |

## Security Layers

```
┌─────────────────────────────────────┐
│   1. Input Validation (Joi)         │
│   - Validate all user inputs        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   2. Authentication (JWT)            │
│   - Verify user identity             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   3. Authorization                   │
│   - Check ownership/permissions      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   4. Password Hashing (bcrypt)       │
│   - Never store plain passwords      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   5. CORS Configuration              │
│   - Control API access               │
└──────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React 18**: UI library
- **React Router v6**: Client-side routing
- **Axios**: HTTP client
- **Context API**: State management
- **React Toastify**: Notifications
- **CSS3**: Styling

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM
- **JWT**: Authentication
- **bcrypt**: Password hashing
- **Multer**: File upload
- **Joi**: Validation
- **Cloudinary**: Image storage

### DevOps
- **npm**: Package manager
- **nodemon**: Development server
- **CORS**: Cross-origin requests
- **dotenv**: Environment variables

## Deployment Architecture

```
┌─────────────────────────────────────┐
│         Vercel/Netlify              │
│      (Frontend Hosting)             │
│   - React build files               │
│   - CDN distribution                │
│   - HTTPS enabled                   │
└──────────────┬──────────────────────┘
               │
               │ API Calls
               │
┌──────────────▼──────────────────────┐
│      Render/Railway/Heroku          │
│      (Backend Hosting)              │
│   - Express server                  │
│   - Environment variables           │
│   - Auto-scaling                    │
└──────────────┬──────────────────────┘
               │
               ├──────────────┬────────────────┐
               │              │                │
┌──────────────▼──┐  ┌────────▼─────┐  ┌──────▼──────┐
│  MongoDB Atlas  │  │  Cloudinary  │  │   JWT       │
│  (Database)     │  │  (Images)    │  │  (Tokens)   │
└─────────────────┘  └──────────────┘  └─────────────┘
```

## Performance Optimizations

1. **Frontend**
   - Code splitting with React Router
   - Lazy loading components
   - Image optimization via Cloudinary
   - Caching API responses

2. **Backend**
   - MongoDB indexing
   - Mongoose population
   - JWT token expiration
   - Error handling middleware

3. **Database**
   - Indexed fields (email, username)
   - Efficient queries
   - Cascade delete (reviews)

## Scalability Considerations

- **Horizontal Scaling**: Add more server instances
- **Database Sharding**: Distribute data across clusters
- **CDN**: Cloudinary for image delivery
- **Caching**: Redis for session management (future)
- **Load Balancing**: Distribute traffic (production)

---

This architecture provides a solid foundation for a production-ready MERN application!
