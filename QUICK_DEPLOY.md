# Nestly - Quick Start Deployment

## 🚀 3-Step Deployment

### Before You Start
You'll need these accounts (all have free tiers):
1. Vercel (free) - https://vercel.com
2. Railway ($5/month) - https://railway.app  
3. Expo (free) - https://expo.dev

---

## Step 1: Deploy Backend (Railway) - 5 minutes

```bash
# 1. Go to https://railway.app
# 2. Sign up with GitHub
# 3. Click "New Project" → "Deploy from GitHub repo"
# 4. Select this repository
# 5. Set root directory: projection/services/fastapi-calcs
# 6. Railway auto-deploys!

# 7. Copy your Railway URL (looks like):
https://your-app.up.railway.app
```

**✅ Backend is live!**

---

## Step 2: Deploy Web App (Vercel) - 5 minutes

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to web app
cd projection/apps/web

# Update production environment
echo "NEXT_PUBLIC_API_URL=https://your-app.up.railway.app" > .env.production

# Deploy!
vercel --prod

# ✅ Web app is live at: https://your-app.vercel.app
```

**Update Railway CORS:**
```bash
# Go to Railway dashboard → Your Project → Variables
# Update ALLOWED_ORIGINS:
https://your-app.vercel.app
```

---

## Step 3: Build Mobile Apps (Expo) - 10 minutes

```bash
# Install EAS CLI
npm install -g eas-cli

# Navigate to mobile app
cd projection/apps/mobile

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Update eas.json with your Railway URL
# (Replace YOUR_EAS_PROJECT_ID after running build:configure)

# Build for iOS (TestFlight)
eas build --platform ios --profile preview

# Build for Android (APK)
eas build --platform android --profile preview

# ✅ Mobile builds will be ready in ~15 minutes
```

---

## 🎉 You're Done!

- **Web App**: https://your-app.vercel.app
- **API**: https://your-app.up.railway.app
- **Mobile**: Download from EAS build or TestFlight

**Total Time**: ~20 minutes  
**Total Cost**: $5/month (Railway only)

---

## Next Steps

1. **Custom Domain** (optional)
   - Add in Vercel dashboard: Settings → Domains
   - Cost: ~$12/year

2. **App Store Submission**
   - See full DEPLOYMENT_GUIDE.md for detailed steps
   - Apple: $99/year
   - Google: $25 one-time

3. **Monitor & Scale**
   - Vercel Dashboard: Analytics & logs
   - Railway Dashboard: Metrics & logs
   - Expo Dashboard: Build history & updates

---

## 💰 Cost Summary

```
Free Tier (Development):
- Vercel: $0
- Railway Free Trial: $0 (first month)
- Expo: $0 (30 builds/month)
Total: $0

Production (Ongoing):
- Vercel: $0 (free tier)
- Railway: $5/month
- Expo: $0 (free tier sufficient)
Total: $5/month

App Store Fees (Annual):
- Apple Developer: $99/year
- Google Play: $25 one-time
```

---

## 🆘 Need Help?

See the full **DEPLOYMENT_GUIDE.md** for:
- Detailed troubleshooting
- CI/CD setup
- App store submission
- Environment configuration
- Advanced features

**Questions?** Check the deployment guide or GitHub issues.
