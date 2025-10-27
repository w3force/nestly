# ✅ Nestly Deployment Configuration Complete

Your Nestly app is now configured for deployment to Vercel, Railway, and Expo!

---

## 📁 Files Created/Modified

### Configuration Files
✅ `projection/apps/web/.env.example` - Web environment template  
✅ `projection/apps/web/.env.production` - Production environment  
✅ `projection/apps/web/vercel.json` - Vercel deployment config  
✅ `projection/apps/mobile/eas.json` - Expo build configuration  
✅ `projection/apps/mobile/app.config.ts` - Expo app configuration  
✅ `projection/services/fastapi-calcs/Dockerfile` - Railway deployment  
✅ `projection/services/fastapi-calcs/.env.example` - API environment template  

### CI/CD Workflows
✅ `.github/workflows/deploy-web.yml` - Automatic web deployment  
✅ `.github/workflows/build-mobile.yml` - Mobile app builds  

### Documentation
✅ `DEPLOYMENT_GUIDE.md` - Complete step-by-step guide  
✅ `QUICK_DEPLOY.md` - 3-step quick start  
✅ `DEPLOYMENT_CHECKLIST.md` - Track your progress  

### Project Updates
✅ `projection/.gitignore` - Updated with deployment files  
✅ `projection/package.json` - Added deployment scripts  

---

## 🎯 Next Steps

### Option 1: Quick Deploy (Recommended for First Time)
```bash
# Follow the 3-step guide
cat QUICK_DEPLOY.md

# Takes ~20 minutes total
# Cost: $5/month (Railway only)
```

### Option 2: Full Deployment (Complete Setup)
```bash
# Follow comprehensive guide
cat DEPLOYMENT_GUIDE.md

# Includes app store submission
# Takes ~2-4 hours
# Cost: $184/year (includes app stores)
```

---

## 📝 Information You'll Need

Before starting deployment, have these ready:

### Accounts (All Free/Low Cost)
1. **GitHub account** - Already have ✅
2. **Vercel** - Sign up: https://vercel.com (FREE)
3. **Railway** - Sign up: https://railway.app ($5/month)
4. **Expo** - Sign up: https://expo.dev (FREE)

### For App Store Submission (Later)
5. **Apple Developer** - $99/year - https://developer.apple.com
6. **Google Play** - $25 one-time - https://play.google.com/console

---

## 🚀 Deployment Commands

### Deploy Backend (Railway)
```bash
# Via Railway Dashboard (recommended):
# 1. Go to https://railway.app
# 2. New Project → Deploy from GitHub
# 3. Select repo → Set root: projection/services/fastapi-calcs
# 4. Auto-deploys!
```

### Deploy Web App (Vercel)
```bash
# Install CLI
npm install -g vercel

# Deploy
cd projection/apps/web
vercel --prod
```

### Build Mobile Apps (Expo)
```bash
# Install CLI
npm install -g eas-cli

# Login and configure
cd projection/apps/mobile
eas login
eas build:configure

# Build for testing
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

---

## 💰 Cost Summary

### Minimum (Development & Testing)
```
Vercel: $0 (free tier)
Railway: $5/month
Expo: $0 (free tier, 30 builds/month)
─────────────
Total: $5/month
```

### Full Production (With App Stores)
```
Monthly:
- Railway: $5

Annual:
- Apple Developer: $99
- Google Play: $25 (one-time)
- Domain (optional): $12
─────────────
Total Year 1: $141 + $60 = $201
Total Year 2+: $116/year
```

---

## 🔧 Configuration Updates Needed

After deploying backend to Railway, update these files with your actual URLs:

### 1. Web App Environment
```bash
# projection/apps/web/.env.production
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app
```

### 2. Mobile App Config
```json
// projection/apps/mobile/eas.json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://your-app.up.railway.app"
      }
    }
  }
}
```

### 3. Backend CORS
```bash
# Railway dashboard → Environment Variables
ALLOWED_ORIGINS=https://your-app.vercel.app
```

---

## ✅ Deployment Checklist

Use `DEPLOYMENT_CHECKLIST.md` to track progress:
- [ ] Railway account created
- [ ] Backend deployed to Railway
- [ ] Railway URL obtained
- [ ] Vercel account created  
- [ ] Web app deployed to Vercel
- [ ] Environment variables updated
- [ ] CORS configured
- [ ] Expo account created
- [ ] Mobile builds successful
- [ ] Apps tested on devices

---

## 📚 Documentation Reference

| File | Purpose | When to Use |
|------|---------|-------------|
| `QUICK_DEPLOY.md` | 3-step quick start | First deployment |
| `DEPLOYMENT_GUIDE.md` | Complete guide | Full setup with app stores |
| `DEPLOYMENT_CHECKLIST.md` | Progress tracker | During deployment |
| `projection/apps/web/vercel.json` | Vercel config | Auto-used by Vercel |
| `projection/apps/mobile/eas.json` | Expo build config | Auto-used by EAS |

---

## 🆘 Common Issues & Solutions

### Build Fails on Vercel
```bash
# Check that monorepo is detected
# Verify build command includes: cd ../.. && pnpm install
```

### CORS Errors
```bash
# Update Railway ALLOWED_ORIGINS
# Include both www and non-www Vercel URLs
```

### Mobile Build Fails
```bash
# Ensure EAS project ID is set in app.config.ts
# Verify bundle identifier is unique
# Check build logs: eas build:list
```

---

## 🎉 Ready to Deploy!

Everything is configured and ready. Choose your path:

**Quick Start (20 min)**: Follow `QUICK_DEPLOY.md`  
**Complete Setup (2-4 hrs)**: Follow `DEPLOYMENT_GUIDE.md`

**Cost**: Start at $5/month, scale as you grow  
**Platforms**: Vercel (web) + Railway (API) + Expo (mobile)

---

## 📞 Support

- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- Expo: https://docs.expo.dev
- GitHub Issues: Report any problems

**Good luck with your deployment! 🚀**
