# 🚀 Exact Commands to Run Your MERN App

## ⚠️ FIRST: Fix MongoDB Connection

Your MongoDB credentials have an authentication error. Please:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click on "Database Access" in the left sidebar
3. Either:
   - **Option A**: Edit your existing user "Umer" and reset the password to something simple (no special characters like `$`)
   - **Option B**: Create a new database user with a simple password
4. Click on "Database" → "Connect" → "Connect your application"
5. Copy the new connection string
6. Update `backend/.env` file with the new connection string

Example of what to update in `backend/.env`:
```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.muifkjm.mongodb.net/explorehut?retryWrites=true&w=majority&appName=Cluster0
```

**Important**: If your password has special characters, URL encode them:
- `@` becomes `%40`
- `$` becomes `%24`
- `#` becomes `%23`
- `%` becomes `%25`

---

## 📦 Step 1: Install Dependencies

### Backend Installation
```bash
cd backend
npm install --legacy-peer-deps
```

**Expected Output:**
```
added 160 packages, and audited 161 packages in 12s
found 0 vulnerabilities
```

### Frontend Installation
```bash
cd ../frontend
npm install
```

**Expected Output:**
```
added 1500+ packages in 2-3 minutes
```

---

## 🚀 Step 2: Start the Application

### Terminal 1 - Start Backend

```bash
cd backend
npm run dev
```

**Expected Output:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

**If you see an error:**
- Check MongoDB connection string in `.env`
- Verify your IP is whitelisted in MongoDB Atlas
- Ensure database user credentials are correct

### Terminal 2 - Start Frontend

Open a **NEW terminal** window and run:

```bash
cd frontend
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view explorehut-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

Your browser will automatically open to `http://localhost:3000`

---

## 🎯 Step 3: Test the Application

### 1. Create an Account
```
1. Click "Sign Up" in the navbar
2. Fill in:
   - Username: testuser
   - Email: test@example.com
   - Password: test123
3. Click "Sign Up"
4. You'll be auto-logged in and redirected to home
```

### 2. Create a Listing
```
1. Click "Add Listing" in navbar
2. Fill in:
   - Title: Beautiful Beach House
   - Description: Amazing ocean views...
   - Price: 150
   - Location: Malibu
   - Country: USA
3. Upload an image (optional)
4. Click "Create Listing"
5. You'll see your listing on the home page
```

### 3. Add a Review
```
1. Click on any listing card
2. Scroll down to "Leave a Review"
3. Select rating (1-5 stars)
4. Write a comment
5. Click "Submit Review"
6. Review appears instantly
```

### 4. Edit Your Listing
```
1. Go to your listing details
2. Click "Edit Listing"
3. Update any field
4. Click "Update Listing"
5. Changes saved!
```

### 5. Delete Your Listing
```
1. Go to your listing details
2. Click "Delete Listing"
3. Confirm deletion
4. Listing removed
```

---

## 🛑 Stop the Application

### Stop Backend
In Terminal 1, press: `Ctrl + C`

### Stop Frontend
In Terminal 2, press: `Ctrl + C`

---

## 🔄 Restart the Application

Just run the same commands again:

**Terminal 1:**
```bash
cd backend
npm run dev
```

**Terminal 2:**
```bash
cd frontend
npm start
```

---

## 🐛 Troubleshooting

### Problem: "Port 5000 already in use"

**Solution:**
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9

# Then restart backend
cd backend
npm run dev
```

### Problem: "Port 3000 already in use"

**Solution:**
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Then restart frontend
cd frontend
npm start
```

### Problem: "MongoDB connection failed"

**Solution:**
1. Check `backend/.env` file
2. Verify MONGODB_URI is correct
3. Go to MongoDB Atlas → Network Access
4. Click "Add IP Address" → "Allow Access from Anywhere"
5. Restart backend server

### Problem: "Cannot find module"

**Solution:**
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Problem: "Cloudinary upload failed"

**Solution:**
1. Check `backend/.env` file
2. Verify Cloudinary credentials are correct
3. Go to Cloudinary dashboard to confirm
4. Restart backend server

---

## 📊 What You Should See

### Backend Terminal
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

### Frontend Terminal
```
webpack compiled successfully
```

### Browser
```
http://localhost:3000
- Beautiful home page with gradient hero
- Listings grid (empty at first)
- Navbar with Login/Signup buttons
```

---

## 🎉 Success Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] MongoDB connected successfully
- [ ] Can create an account
- [ ] Can login
- [ ] Can create a listing
- [ ] Can upload images
- [ ] Can add reviews
- [ ] Can edit own listings
- [ ] Can delete own listings

---

## 📝 Quick Reference

### Backend URL
```
http://localhost:5000
```

### Frontend URL
```
http://localhost:3000
```

### API Endpoints
```
POST   http://localhost:5000/api/auth/signup
POST   http://localhost:5000/api/auth/login
GET    http://localhost:5000/api/listings
POST   http://localhost:5000/api/listings
GET    http://localhost:5000/api/listings/:id
PUT    http://localhost:5000/api/listings/:id
DELETE http://localhost:5000/api/listings/:id
POST   http://localhost:5000/api/reviews/:listingId
DELETE http://localhost:5000/api/reviews/:reviewId
```

---

## 🚀 Ready to Deploy?

Once everything works locally, check out:
- `README.md` for deployment instructions
- `ARCHITECTURE.md` for system design
- `VISUAL_GUIDE.md` for UI reference

---

**Happy Coding! 🎉**
