# Nestly Deployment Guide

Complete guide for deploying Nestly to Vercel, Railway, and App Stores.

## 📋 Prerequisites

### Required Accounts
- [ ] GitHub account
- [ ] Vercel account (free) - https://vercel.com
- [ ] Railway account ($5/month) - https://railway.app
- [ ] Expo account (free) - https://expo.dev
- [ ] Apple Developer ($99/year) - For iOS app
- [ ] Google Play Console ($25 one-time) - For Android app

### Required Tools
```bash
# Install required CLIs
npm install -g vercel eas-cli

# Verify installations
vercel --version
eas --version
```

---

## 🌐 Part 1: Deploy Backend to Railway

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project

### Step 2: Deploy FastAPI Backend
```bash
# From project root
cd projection/services/fastapi-calcs

# Create .env file
cp .env.example .env

# Update .env with production values
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
APP_ENV=production
```

### Step 3: Connect to Railway
1. In Railway dashboard: New Project → Deploy from GitHub
2. Select your repository
3. Set root directory: `projection/services/fastapi-calcs`
4. Railway auto-detects Python and Dockerfile
5. Add environment variables:
   - `ALLOWED_ORIGINS`: (Will update after Vercel deployment)
   - `PORT`: 8000

### Step 4: Get Railway URL
```bash
# After deployment, Railway provides URL like:
https://your-app.up.railway.app

# Test it:
curl https://your-app.up.railway.app/health
```

**Copy this URL - you'll need it for Vercel and mobile apps.**

---

## 🚀 Part 2: Deploy Web App to Vercel

### Step 1: Update API URL
```bash
cd projection/apps/web

# Update .env.production with Railway URL
echo "NEXT_PUBLIC_API_URL=https://your-app.up.railway.app" > .env.production
echo "NEXT_PUBLIC_APP_ENV=production" >> .env.production
```

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Login to Vercel
vercel login

# Deploy from web directory
cd projection/apps/web
vercel --prod

# Follow prompts:
# - Link to existing project? No
# - Project name? nestly
# - Directory? ./
```

#### Option B: Vercel Dashboard
1. Go to https://vercel.com/new
2. Import Git Repository
3. Select your GitHub repo
4. Configure:
   - Framework: Next.js
   - Root Directory: `projection/apps/web`
   - Build Command: `cd ../.. && pnpm install && pnpm --filter web build`
   - Install Command: `pnpm install`
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your Railway URL
   - `NEXT_PUBLIC_APP_ENV`: production
6. Deploy

### Step 3: Update CORS on Railway
```bash
# Go to Railway dashboard
# Update ALLOWED_ORIGINS environment variable:
ALLOWED_ORIGINS=https://your-app.vercel.app,https://www.your-app.vercel.app

# Railway will auto-redeploy
```

### Step 4: Test Deployment
```bash
# Visit your Vercel URL
https://your-app.vercel.app

# Test API connectivity
# Calculator should work end-to-end
```

---

## 📱 Part 3: Build Mobile Apps with Expo

### Step 1: Configure EAS
```bash
cd projection/apps/mobile

# Login to Expo
eas login

# Configure project
eas build:configure
```

### Step 2: Update Configuration

Edit `eas.json` and update:
```json
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

Edit `app.config.ts` and update:
```typescript
extra: {
  eas: {
    projectId: "YOUR_EAS_PROJECT_ID" // Get from eas build:configure
  }
}
```

### Step 3: Build for iOS (Preview)
```bash
# Build for TestFlight
eas build --platform ios --profile preview

# This will:
# - Upload code to Expo servers
# - Build iOS app in cloud (no Mac needed!)
# - Provide download link or TestFlight upload
```

### Step 4: Build for Android (Preview)
```bash
# Build APK for testing
eas build --platform android --profile preview

# Download and install on Android device
```

### Step 5: Production Builds
```bash
# iOS App Store
eas build --platform ios --profile production

# Android Play Store
eas build --platform android --profile production
```

---

## 🍎 Part 4: Submit to Apple App Store

### Prerequisites
- Apple Developer Account ($99/year)
- App Store Connect access

### Step 1: Create App in App Store Connect
1. Go to https://appstoreconnect.apple.com
2. My Apps → + → New App
3. Fill in:
   - Platform: iOS
   - Name: Nestly
   - Primary Language: English
   - Bundle ID: com.w3force.nestly
   - SKU: nestly-ios

### Step 2: Configure eas.json for Submission
```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "YOUR_ASC_APP_ID",
        "appleTeamId": "YOUR_APPLE_TEAM_ID"
      }
    }
  }
}
```

### Step 3: Submit Build
```bash
# Build and submit in one command
eas build --platform ios --profile production --auto-submit

# Or submit existing build
eas submit --platform ios
```

### Step 4: Complete App Store Listing
1. Screenshots (required sizes)
2. App description
3. Keywords
4. Privacy policy URL
5. Support URL
6. Age rating
7. Submit for review

---

## 🤖 Part 5: Submit to Google Play Store

### Prerequisites
- Google Play Console Account ($25 one-time)

### Step 1: Create App in Play Console
1. Go to https://play.google.com/console
2. Create app
3. Fill in:
   - App name: Nestly
   - Default language: English
   - App or game: App
   - Free or paid: Free

### Step 2: Create Service Account (for automated submission)
1. Google Cloud Console → IAM & Admin → Service Accounts
2. Create service account
3. Download JSON key
4. Save as `google-service-account.json` in mobile directory

### Step 3: Configure eas.json
```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

### Step 4: Submit Build
```bash
# Build and submit
eas build --platform android --profile production --auto-submit

# Or submit existing build
eas submit --platform android
```

### Step 5: Complete Play Store Listing
1. App icon (512x512)
2. Feature graphic (1024x500)
3. Screenshots
4. App description
5. Privacy policy
6. Content rating questionnaire
7. Publish to internal testing first

---

## 🔄 Part 6: Continuous Deployment

### GitHub Secrets Configuration
Add these secrets to your GitHub repository:

1. Go to Repository → Settings → Secrets and variables → Actions
2. Add secrets:
   ```
   VERCEL_TOKEN - From vercel.com/account/tokens
   VERCEL_ORG_ID - From vercel.com (project settings)
   VERCEL_PROJECT_ID - From vercel.com (project settings)
   EXPO_TOKEN - From expo.dev/accounts/[account]/settings/access-tokens
   API_URL - Your Railway app URL
   ```

### Automatic Deployments
```bash
# Web app deploys automatically on push to main
git push origin main

# Mobile apps can be triggered via:
# GitHub Actions → Build Mobile Apps → Run workflow
```

---

## 💰 Cost Summary

```
Year 1 Costs:
- Vercel: $0 (free tier)
- Railway: $60 ($5/month x 12)
- Expo: $0 (free tier, 30 builds/month)
- Apple Developer: $99
- Google Play: $25
- Custom Domain (optional): $12-15

Total: $184-199/year
```

---

## ✅ Post-Deployment Checklist

### Web App
- [ ] Vercel deployment successful
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] API connectivity working
- [ ] Calculator functions properly

### Mobile Apps
- [ ] iOS build successful
- [ ] Android build successful
- [ ] TestFlight working
- [ ] API connectivity from mobile
- [ ] App Store listing complete
- [ ] Play Store listing complete

### Backend
- [ ] Railway deployment successful
- [ ] CORS configured correctly
- [ ] Health endpoint responding
- [ ] Environment variables set
- [ ] Monitoring enabled

---

## 🆘 Troubleshooting

### Common Issues

**Vercel build fails:**
```bash
# Check build logs in Vercel dashboard
# Verify pnpm workspace is detected
# Ensure all dependencies are in package.json
```

**Railway timeout:**
```bash
# Increase timeout in Railway settings
# Check application logs
# Verify port 8000 is exposed
```

**Mobile build fails:**
```bash
# Check EAS build logs
eas build:list

# Common fixes:
# - Update app.config.ts with correct projectId
# - Verify bundle identifier is unique
# - Check iOS provisioning profile
```

**CORS errors:**
```bash
# Update Railway ALLOWED_ORIGINS
# Include both www and non-www domains
# Restart Railway service
```

---

## 📞 Support Resources

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Expo Docs: https://docs.expo.dev
- EAS Build: https://docs.expo.dev/build/introduction

---

## 🎉 You're Live!

Once all steps are complete:
- Web app: https://your-app.vercel.app
- iOS app: Available on TestFlight / App Store
- Android app: Available on Play Store (after review)

**Total deployment time: 2-4 hours**
