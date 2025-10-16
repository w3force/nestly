# Mobile Monte Carlo Fixes - Summary

## Issues Fixed

### 1. ✅ Missing Input Fields
**Problem**: Mobile app was missing several Monte Carlo input fields compared to web app.

**Solution**: Added the following input fields to match web functionality:
- Inflation (%)
- Salary Growth (%)
- Employer Match Rate (%)
- Rebalance Annually (toggle switch)

All fields now have the themed outline styling (#4ABDAC outline, #69B47A active).

### 2. ✅ API Connection Failed - Network Request Failed
**Problem**: Mobile app getting "Network request failed" error because:
1. Hardcoded `http://localhost:8000` doesn't work on Android Emulator or physical devices
2. CORS was blocking requests from Expo
3. Backend wasn't configured to accept connections from all network interfaces

**Solution**: 
- Created smart `apps/mobile/config.ts` that detects platform:
  - **iOS Simulator**: Uses `http://localhost:8000`
  - **Android Emulator**: Uses `http://10.0.2.2:8000` (special alias for host machine)
  - **Physical Device**: Instructions to use your computer's IP (e.g., `http://192.168.68.96:8000`)
- Updated backend CORS to allow all origins in development mode (`allow_origins=["*"]`)
- Backend now runs on `0.0.0.0:8000` (all network interfaces)
- Enhanced error messages with helpful debugging tips
- Added console logging for request/response debugging

### 3. ✅ Backend Configuration
**Problem**: Backend CORS was too restrictive and only allowed localhost origins.

**Solution**: Updated `services/fastapi-calcs/app.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
```

## Files Modified

1. **apps/mobile/app/calculator.tsx**
   - Imported `API_BASE_URL` from config
   - Updated `runMonteCarlo()` to use `${API_BASE_URL}/monte-carlo`
   - Added 4 new input fields (Inflation, Salary Growth, Employer Match, Rebalance)
   - Enhanced error handling with detailed messages including API URL
   - Added console logging for debugging
   - Updated payload to include all required fields

2. **apps/mobile/config.ts** (NEW)
   - Smart platform detection (iOS vs Android vs Physical)
   - Automatic URL configuration:
     - iOS Simulator: `localhost:8000`
     - Android Emulator: `10.0.2.2:8000`
     - Physical Device: Commented instructions for IP address
   - Includes detailed comments for setup

3. **apps/mobile/README.md** (NEW)
   - Complete setup guide for simulator and physical device
   - Troubleshooting section
   - IP address configuration instructions

4. **services/fastapi-calcs/app.py** (UPDATED)
   - Changed CORS from restrictive localhost-only to `allow_origins=["*"]` for development
   - Backend now accessible from any device on network

## Platform-Specific URLs

### ✅ iOS Simulator
```typescript
// Already configured - uses localhost
API_BASE_URL = 'http://localhost:8000'
```

### ✅ Android Emulator
```typescript
// Already configured - uses special Android emulator alias
API_BASE_URL = 'http://10.0.2.2:8000'
```

### 📱 Physical Device (iPhone/Android)
Edit `apps/mobile/config.ts` and uncomment the last line:
```typescript
export const API_BASE_URL = 'http://192.168.68.96:8000';  // Your computer's IP
```

## Testing on Physical Device

If you want to test on your iPhone or Android phone:

1. **Get your computer's IP address:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   # Your IP: 192.168.68.96
   ```

2. **Update config.ts - Uncomment the last line:**
   ```typescript
   // At the bottom of apps/mobile/config.ts:
   export const API_BASE_URL = 'http://192.168.68.96:8000';
   ```

3. **Ensure both devices on same WiFi**

4. **Run the mobile app:**
   ```bash
   cd projection
   pnpm --filter mobile start
   # Scan QR code with Expo Go app
   ```

## Starting the Backend

The backend MUST be running for Monte Carlo to work:

```bash
# Method 1: Interactive (see logs)
cd projection/services/fastapi-calcs
uvicorn app:app --reload --host 0.0.0.0

# Method 2: Background
cd projection/services/fastapi-calcs
nohup uvicorn app:app --reload --host 0.0.0.0 > /tmp/fastapi.log 2>&1 &

# Verify it's running
curl http://localhost:8000/healthz
# Should return: {"ok":true}
```

## Current Status

✅ Backend running on `http://0.0.0.0:8000`  
✅ All Monte Carlo input fields added  
✅ iOS Simulator: Auto-configured to `localhost:8000`  
✅ Android Emulator: Auto-configured to `10.0.2.2:8000`  
✅ Physical Device: Instructions provided for IP configuration  
✅ CORS: Allows all origins in development  
✅ Mobile theme matches web theme  

## Troubleshooting "Network request failed"

### ✅ 1. Check Backend is Running
```bash
curl http://localhost:8000/healthz
# Should return: {"ok":true}
```

If not running, start it:
```bash
cd projection/services/fastapi-calcs
uvicorn app:app --reload --host 0.0.0.0
```

### ✅ 2. Platform-Specific URLs

**iOS Simulator**: Should work automatically with `localhost:8000`

**Android Emulator**: Should work automatically with `10.0.2.2:8000`

**Physical Device**: You MUST update `apps/mobile/config.ts`:
```typescript
// Uncomment and update with YOUR computer's IP
export const API_BASE_URL = 'http://192.168.68.96:8000';
```

### ✅ 3. Check Network Connection

For physical devices:
- ✅ Phone and computer on same WiFi network
- ✅ No firewall blocking port 8000
- ✅ Backend running with `--host 0.0.0.0` (not just `localhost`)

### ✅ 4. Test Backend from Terminal

```bash
# Should return success probability, percentiles, etc.
curl -X POST http://localhost:8000/monte-carlo \
  -H "Content-Type: application/json" \
  -d '{
    "current_age": 30,
    "retire_age": 65,
    "current_balance": 50000,
    "annual_contrib": 10000,
    "employer_match_rate": 0,
    "expected_return": 0.07,
    "return_volatility": 0.15,
    "inflation": 0.02,
    "salary_growth": 0.03,
    "n_paths": 100,
    "seed": 42,
    "fees_annual": 0.005,
    "glidepath": false,
    "rebalance_annually": true
  }'
```

## Next Steps

1. ✅ Backend is running
2. Test on your platform:
   - **iOS Simulator**: Should work immediately
   - **Android Emulator**: Should work immediately  
   - **Physical Device**: Update config.ts with your IP
3. Open Expo app and try Monte Carlo calculation
4. Check console logs in Expo for debugging info

