# 🔒 Security Setup Guide

## ⚠️ **IMPORTANT: Environment Variables**

This repository does NOT contain any hardcoded credentials. All sensitive information must be configured using environment variables.

---

## 📋 **Required Environment Variables**

### **Backend Configuration**

Create a `backend/.env` file with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Configuration
# Get your connection string from MongoDB Atlas
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/explorehub

# JWT Configuration
# Generate strong random strings for production
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_in_production
JWT_REFRESH_EXPIRE=7d

# Redis Configuration (Optional - app works without it)
REDIS_HOST=localhost
REDIS_PORT=6379

# Cloudinary Configuration
# Get these from your Cloudinary dashboard
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### **Frontend Configuration (Optional)**

Create a `frontend/.env` file if you need custom API URLs:

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:5000

# Socket.IO URL (usually same as API URL)
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## 🔑 **How to Get Your Credentials**

### **1. MongoDB Atlas**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Replace `<username>`, `<password>`, and `<dbname>` in the connection string

**Example:**
```
mongodb+srv://myuser:mypassword@cluster0.mongodb.net/explorehub
```

### **2. Cloudinary**

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to Dashboard
4. Copy your:
   - Cloud Name
   - API Key
   - API Secret

### **3. JWT Secrets**

Generate strong random strings for JWT secrets:

**Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Using OpenSSL:**
```bash
openssl rand -hex 64
```

---

## 🚀 **Deployment Configuration**

### **Choreo.dev**

Set environment variables in Choreo dashboard:

1. Go to your Choreo project
2. Navigate to Settings → Environment Variables
3. Add all variables from `backend/.env.example`
4. Use production values (strong secrets, production MongoDB URI)

### **Vercel (Frontend)**

Set environment variables in Vercel dashboard:

1. Go to your Vercel project
2. Navigate to Settings → Environment Variables
3. Add:
   - `REACT_APP_API_URL` = Your backend URL
   - `REACT_APP_SOCKET_URL` = Your backend URL

### **Heroku/Railway/Render (Backend)**

Set environment variables using CLI or dashboard:

**Heroku:**
```bash
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
# ... add all other variables
```

**Railway:**
```bash
railway variables set MONGODB_URI=your_mongodb_uri
railway variables set JWT_SECRET=your_jwt_secret
# ... add all other variables
```

---

## ✅ **Security Checklist**

Before making your repository public:

- [ ] All `.env` files are in `.gitignore`
- [ ] No hardcoded credentials in code files
- [ ] No hardcoded credentials in documentation
- [ ] `.env.example` files created with placeholder values
- [ ] Production secrets are strong and unique
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Cloudinary account secured with 2FA
- [ ] JWT secrets are at least 64 characters
- [ ] All team members have their own credentials

---

## 🔒 **Best Practices**

### **1. Never Commit Secrets**

```bash
# ❌ NEVER do this
git add backend/.env
git commit -m "Add env file"

# ✅ Always check before committing
git status
# Make sure .env files are NOT listed
```

### **2. Use Different Secrets for Each Environment**

- **Development:** Use test/development credentials
- **Staging:** Use staging-specific credentials
- **Production:** Use strong, unique production credentials

### **3. Rotate Secrets Regularly**

- Change JWT secrets every 3-6 months
- Rotate API keys if compromised
- Update database passwords periodically

### **4. Use Strong Secrets**

```bash
# ❌ Weak
JWT_SECRET=secret123

# ✅ Strong
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### **5. Monitor for Exposed Secrets**

- Use GitHub secret scanning
- Use tools like `git-secrets` or `truffleHog`
- Enable alerts for exposed credentials

---

## 🆘 **If Secrets Are Exposed**

If you accidentally commit secrets to GitHub:

### **Immediate Actions:**

1. **Revoke the exposed credentials immediately**
   - Change MongoDB password
   - Regenerate Cloudinary API keys
   - Generate new JWT secrets

2. **Remove from Git history**
   ```bash
   # Use BFG Repo-Cleaner or git-filter-repo
   # This is complex - consider creating a new repo if needed
   ```

3. **Force push cleaned history**
   ```bash
   git push --force origin main
   ```

4. **Notify your team**
   - Inform all team members
   - Update deployment configurations
   - Monitor for unauthorized access

### **Prevention:**

- Use pre-commit hooks to scan for secrets
- Enable GitHub secret scanning
- Use `.env` files exclusively for secrets
- Never hardcode credentials in code

---

## 📚 **Additional Resources**

- [MongoDB Atlas Security](https://docs.atlas.mongodb.com/security/)
- [Cloudinary Security](https://cloudinary.com/documentation/security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

## 🔍 **Verify Your Setup**

Run these checks before deploying:

```bash
# 1. Check .gitignore
cat .gitignore | grep .env
# Should show: .env

# 2. Check for hardcoded secrets
grep -r "mongodb+srv://" --exclude-dir=node_modules --exclude="*.md" .
# Should return no results in code files

# 3. Verify .env is not tracked
git ls-files | grep .env
# Should return no results

# 4. Test environment variables
cd backend
node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI ? '✅ Loaded' : '❌ Missing')"
```

---

**Remember: Security is not a one-time setup. Regularly review and update your security practices!** 🔒
