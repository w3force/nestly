# 📋 Deployment Checklist

## Information Needed Before Deployment

### 1. Railway Account Info
- [ ] Railway account created
- [ ] GitHub connected to Railway
- Railway URL: `_________________________`

### 2. Vercel Account Info  
- [ ] Vercel account created
- [ ] GitHub connected to Vercel
- Vercel URL: `_________________________`

### 3. Expo Account Info
- [ ] Expo account created
- [ ] EAS CLI installed
- EAS Project ID: `_________________________`

### 4. Apple Developer (iOS Only)
- [ ] Apple Developer account ($99/year)
- Apple ID: `_________________________`
- Team ID: `_________________________`
- ASC App ID: `_________________________`

### 5. Google Play (Android Only)
- [ ] Google Play Console account ($25)
- [ ] Service account created
- Package name: `com.w3force.nestly` (default)

### 6. Domain (Optional)
- [ ] Custom domain purchased
- Domain: `_________________________`
- Configured with: [ ] Vercel [ ] Other

---

## Deployment Progress

### Backend (Railway)
- [ ] Railway project created
- [ ] Repository connected
- [ ] Root directory set: `projection/services/fastapi-calcs`
- [ ] Auto-deployment configured
- [ ] Environment variables added:
  - [ ] `ALLOWED_ORIGINS`
  - [ ] `PORT=8000`
- [ ] Health endpoint tested
- [ ] Railway URL recorded above

### Web App (Vercel)
- [ ] Vercel project created
- [ ] `.env.production` updated with Railway URL
- [ ] Deployed via CLI or dashboard
- [ ] Environment variables added:
  - [ ] `NEXT_PUBLIC_API_URL`
  - [ ] `NEXT_PUBLIC_APP_ENV=production`
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Calculator functionality tested
- [ ] Railway CORS updated with Vercel URL

### Mobile App (Expo)
- [ ] EAS CLI installed
- [ ] Logged into Expo account
- [ ] `eas build:configure` completed
- [ ] EAS Project ID added to `app.config.ts`
- [ ] Railway URL added to `eas.json`
- [ ] iOS preview build successful
- [ ] Android preview build successful
- [ ] TestFlight tested (iOS)
- [ ] APK tested (Android)

### iOS App Store (Production)
- [ ] App created in App Store Connect
- [ ] Bundle ID: `com.w3force.nestly`
- [ ] App icon uploaded (1024x1024)
- [ ] Screenshots uploaded (all required sizes)
- [ ] App description written
- [ ] Privacy policy URL added
- [ ] Support URL added
- [ ] Age rating completed
- [ ] Production build submitted
- [ ] App approved and live

### Android Play Store (Production)
- [ ] App created in Play Console
- [ ] Package: `com.w3force.nestly`
- [ ] App icon uploaded (512x512)
- [ ] Feature graphic uploaded (1024x500)
- [ ] Screenshots uploaded
- [ ] App description written
- [ ] Privacy policy URL added
- [ ] Content rating completed
- [ ] Service account JSON created
- [ ] Production build submitted
- [ ] App approved and live

### CI/CD (Optional)
- [ ] GitHub secrets configured:
  - [ ] `VERCEL_TOKEN`
  - [ ] `VERCEL_ORG_ID`
  - [ ] `VERCEL_PROJECT_ID`
  - [ ] `EXPO_TOKEN`
  - [ ] `API_URL`
- [ ] Web deployment workflow tested
- [ ] Mobile build workflow tested

---

## Post-Deployment Verification

### Functionality Tests
- [ ] Web app loads correctly
- [ ] Calculator works on web
- [ ] API responds to web requests
- [ ] Mobile app connects to API
- [ ] Calculator works on mobile
- [ ] Data persists correctly
- [ ] No CORS errors
- [ ] SSL certificates valid

### Performance Tests
- [ ] Web app loads in < 3 seconds
- [ ] API responds in < 2 seconds
- [ ] Mobile app responsive
- [ ] No timeout errors

### Monitoring Setup
- [ ] Vercel analytics enabled
- [ ] Railway metrics monitored
- [ ] Error tracking configured (optional)
- [ ] Uptime monitoring (optional)

---

## URLs & Access

Record your deployment URLs here:

```
Production Web: https://___________________
Production API: https://___________________
Vercel Dashboard: https://vercel.com/dashboard
Railway Dashboard: https://railway.app/dashboard
Expo Dashboard: https://expo.dev/accounts/[username]/projects
App Store Connect: https://appstoreconnect.apple.com
Google Play Console: https://play.google.com/console
```

---

## Cost Tracking

Monthly costs:
- Railway: $5
- Vercel: $0 (free tier)
- Expo: $0 (free tier)
- **Total: $5/month**

Annual costs:
- Apple Developer: $99/year
- Google Play: $25 (one-time)
- Domain (optional): $12-15/year

---

## Notes & Issues

Use this space to track any deployment issues or special configurations:

```
Date: _____________
Issue: _________________________________________________________________
Solution: ______________________________________________________________

Date: _____________
Issue: _________________________________________________________________
Solution: ______________________________________________________________
```

---

## 🎉 Deployment Complete!

When all boxes are checked, your Nestly app is fully deployed and live!

- Web: ✅ Live on Vercel
- API: ✅ Running on Railway  
- iOS: ✅ Available on App Store / TestFlight
- Android: ✅ Available on Play Store

**Congratulations! 🚀**
