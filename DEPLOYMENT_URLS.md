# 🔗 Nestly Deployment URLs

Fill in your actual deployment URLs as you complete each step.

---

## Backend (Railway)

**Railway Dashboard**: https://railway.app/dashboard

**Your Railway App URL**:
```
https://______________________.up.railway.app
```

**Environment Variables Set**:
- [ ] `ALLOWED_ORIGINS` = (Vercel URL after web deployment)
- [ ] `PORT` = 8000
- [ ] `APP_ENV` = production

---

## Web App (Vercel)

**Vercel Dashboard**: https://vercel.com/dashboard

**Your Vercel App URL**:
```
https://______________________.vercel.app
```

**Custom Domain** (optional):
```
https://______________________
```

**Environment Variables Set**:
- [ ] `NEXT_PUBLIC_API_URL` = (Railway URL from above)
- [ ] `NEXT_PUBLIC_APP_ENV` = production

---

## Mobile Apps (Expo)

**Expo Dashboard**: https://expo.dev

**EAS Project ID**:
```
________________________________________
```

**iOS Bundle Identifier**: `com.w3force.nestly`

**Android Package**: `com.w3force.nestly`

---

## App Stores

### Apple App Store

**App Store Connect**: https://appstoreconnect.apple.com

**Apple ID**: `____________________@____________________`

**Team ID**: `____________________`

**ASC App ID**: `____________________`

**App URL** (after approval):
```
https://apps.apple.com/app/______________________
```

### Google Play Store

**Play Console**: https://play.google.com/console

**App URL** (after approval):
```
https://play.google.com/store/apps/details?id=com.w3force.nestly
```

---

## GitHub Actions

**Repository Secrets** (Settings → Secrets → Actions):

- [ ] `VERCEL_TOKEN` - From vercel.com/account/tokens
- [ ] `VERCEL_ORG_ID` - From Vercel project settings
- [ ] `VERCEL_PROJECT_ID` - From Vercel project settings
- [ ] `EXPO_TOKEN` - From expo.dev/accounts/[username]/settings/access-tokens
- [ ] `API_URL` - Railway URL from above

---

## Update Configuration Files

After getting your URLs, update these files:

### 1. Update Railway URL in Web App
```bash
cd projection/apps/web
echo "NEXT_PUBLIC_API_URL=https://YOUR-RAILWAY-URL.up.railway.app" > .env.production
```

### 2. Update Railway URL in Mobile App
```bash
# Edit: projection/apps/mobile/eas.json
# Line: "EXPO_PUBLIC_API_URL": "https://YOUR-RAILWAY-URL.up.railway.app"
```

### 3. Update Vercel URL in Railway
```bash
# Go to: Railway Dashboard → Your Project → Variables
# Update: ALLOWED_ORIGINS=https://YOUR-VERCEL-URL.vercel.app
```

### 4. Update EAS Project ID
```bash
# Edit: projection/apps/mobile/app.config.ts
# Line: projectId: 'YOUR_EAS_PROJECT_ID'
```

---

## Quick Reference

| Service | URL | Cost |
|---------|-----|------|
| Railway | https://railway.app | $5/month |
| Vercel | https://vercel.com | FREE |
| Expo | https://expo.dev | FREE |
| Apple | https://developer.apple.com | $99/year |
| Google | https://play.google.com/console | $25 one-time |

---

## Testing URLs

After deployment, test these endpoints:

### Backend Health Check
```bash
curl https://YOUR-RAILWAY-URL.up.railway.app/health
# Should return: {"status": "healthy"}
```

### Web App
```bash
# Open in browser:
https://YOUR-VERCEL-URL.vercel.app

# Test calculator functionality
```

### Mobile Apps
```bash
# Download from EAS build:
eas build:list

# Or scan QR code from:
# iOS: TestFlight
# Android: Direct APK download
```

---

## 📝 Deployment Timeline

| Step | Time | Status |
|------|------|--------|
| Railway Backend | 5 min | [ ] |
| Vercel Web | 5 min | [ ] |
| Update URLs | 2 min | [ ] |
| Test Integration | 3 min | [ ] |
| EAS Configure | 5 min | [ ] |
| iOS Build | 15 min | [ ] |
| Android Build | 15 min | [ ] |
| **Total** | **~50 min** | |

---

## ✅ Verification Checklist

- [ ] Railway app responds at: `https://YOUR-URL.up.railway.app/health`
- [ ] Vercel app loads at: `https://YOUR-URL.vercel.app`
- [ ] Calculator works on web
- [ ] No CORS errors in browser console
- [ ] Mobile builds successful (check `eas build:list`)
- [ ] iOS app testable on TestFlight
- [ ] Android APK installs and runs
- [ ] All apps connect to Railway backend

---

**Save this file after filling in your URLs for future reference!**
