# 🚀 Quick Fix: "Network request failed" Error

## The Problem
Your mobile app shows: `ERROR Monte Carlo Error: [TypeError: Network request failed]`

## The Solution (Pick Your Platform)

### 📱 Are you testing on...?

#### ✅ **iOS Simulator**
**Action**: Nothing! Should work automatically.  
**Why**: iOS Simulator can access your Mac's `localhost:8000`

If still failing:
```bash
# 1. Check backend is running
curl http://localhost:8000/healthz

# 2. Restart backend
cd projection/services/fastapi-calcs
uvicorn app:app --reload --host 0.0.0.0
```

---

#### ✅ **Android Emulator**  
**Action**: Nothing! Should work automatically.  
**Why**: Config auto-uses `10.0.2.2:8000` (Android's special localhost alias)

If still failing:
```bash
# 1. Check backend is running
curl http://localhost:8000/healthz

# 2. Restart backend with 0.0.0.0
cd projection/services/fastapi-calcs
uvicorn app:app --reload --host 0.0.0.0

# 3. Test from Android emulator adb shell
adb shell
curl http://10.0.2.2:8000/healthz
```

---

#### 📱 **Physical Device (Real iPhone/Android Phone)**
**Action**: You MUST update the config file!

```bash
# Step 1: Get your computer's IP
ifconfig | grep "inet " | grep -v 127.0.0.1
# Example output: 192.168.68.96

# Step 2: Edit apps/mobile/config.ts
# Uncomment the LAST LINE and add your IP:
```

```typescript
// At the bottom of apps/mobile/config.ts:
export const API_BASE_URL = 'http://192.168.68.96:8000';  // ← Your IP here
```

```bash
# Step 3: Ensure backend runs on all interfaces
cd projection/services/fastapi-calcs
uvicorn app:app --reload --host 0.0.0.0  # ← Must use 0.0.0.0!

# Step 4: Verify from another terminal
curl http://192.168.68.96:8000/healthz
# Should return: {"ok":true}

# Step 5: Restart Expo app
# Press 'r' in Expo terminal to reload
```

**Checklist for Physical Device:**
- ✅ Phone and computer on SAME WiFi network
- ✅ Updated `config.ts` with your computer's IP
- ✅ Backend running with `--host 0.0.0.0` (NOT just `uvicorn app:app`)
- ✅ No firewall blocking port 8000
- ✅ Can reach backend from browser: `http://YOUR_IP:8000/healthz`

---

## Still Not Working?

### Debug in 3 Steps:

**1. Test backend from your computer:**
```bash
curl http://localhost:8000/healthz
# Should return: {"ok":true}
```

**2. Test backend from network (physical device only):**
```bash
# Replace with YOUR IP
curl http://192.168.68.96:8000/healthz
# Should return: {"ok":true}
```

**3. Check Expo logs:**
```bash
# In Expo terminal, look for:
# "Monte Carlo Request: { url: ... }"
# Check what URL is being used!
```

---

## Quick Command Reference

```bash
# Start backend (CORRECT - allows network access)
cd projection/services/fastapi-calcs
uvicorn app:app --reload --host 0.0.0.0

# Start backend (WRONG - localhost only, won't work on physical device)
uvicorn app:app --reload  # ❌ Missing --host 0.0.0.0

# Check if backend is running
curl http://localhost:8000/healthz

# Get your computer's IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Test full Monte Carlo request
curl -X POST http://localhost:8000/monte-carlo \
  -H "Content-Type: application/json" \
  -d '{"current_age":30,"retire_age":65,"current_balance":50000,"annual_contrib":10000,"employer_match_rate":0,"expected_return":0.07,"return_volatility":0.15,"inflation":0.02,"salary_growth":0.03,"n_paths":100,"seed":42,"fees_annual":0.005,"glidepath":false,"rebalance_annually":true}'
```

---

## TL;DR

| Platform | Config Needed? | URL Used |
|----------|----------------|----------|
| iOS Simulator | ❌ No | `localhost:8000` |
| Android Emulator | ❌ No | `10.0.2.2:8000` |
| Physical Device | ✅ **YES!** | Update config.ts with your IP |

**Always start backend with:** `uvicorn app:app --reload --host 0.0.0.0`
