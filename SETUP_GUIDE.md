# 🚀 Quick Setup Guide - Explore Hut MERN

## Step-by-Step Instructions to Run the Project

### Step 1: Install Backend Dependencies

Open a terminal and run:

\`\`\`bash
cd backend
npm install
\`\`\`

This will install all backend dependencies including Express, MongoDB, JWT, Cloudinary, etc.

### Step 2: Install Frontend Dependencies

Open another terminal and run:

\`\`\`bash
cd frontend
npm install
\`\`\`

This will install React and all frontend dependencies.

### Step 3: Start the Backend Server

In the backend terminal:

\`\`\`bash
npm run dev
\`\`\`

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

### Step 4: Start the Frontend

In the frontend terminal:

\`\`\`bash
npm start
\`\`\`

Your browser will automatically open to `http://localhost:3000`

### Step 5: Test the Application

1. **Sign Up**: Create a new account
2. **Login**: Use your credentials
3. **Create a Listing**: Add a property with image
4. **View Listings**: Browse all properties
5. **Add Reviews**: Leave reviews on listings

## 🎉 That's It!

Your MERN application is now running!

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check your internet connection
- Verify MongoDB Atlas credentials in `backend/.env`
- Ensure your IP is whitelisted in MongoDB Atlas

### Port Already in Use
- Kill the process using the port:
  ```bash
  # For port 5000
  lsof -ti:5000 | xargs kill -9
  
  # For port 3000
  lsof -ti:3000 | xargs kill -9
  ```

### Cloudinary Upload Error
- Verify Cloudinary credentials in `backend/.env`
- Check image file size (should be < 10MB)

## 📞 Need Help?

Check the main README.md for detailed documentation.
