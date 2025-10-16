# Mobile App Setup

## Quick Start

### 1. Start the Backend
```bash
# From the projection directory
cd services/fastapi-calcs
uvicorn app:app --reload --host 0.0.0.0
```

### 2. Run the Mobile App
```bash
# From the projection directory
pnpm --filter mobile start
```

Then choose your platform:
- Press `i` for iOS simulator ✅ (Works automatically)
- Press `a` for Android emulator ✅ (Works automatically)
- Scan QR code with Expo Go for physical device 📱 (Requires IP configuration - see below)

## Platform-Specific Configuration

### ✅ iOS Simulator
**No configuration needed!** The app automatically uses `http://localhost:8000`

### ✅ Android Emulator
**No configuration needed!** The app automatically uses `http://10.0.2.2:8000`  
(This is a special Android alias that maps to your computer's localhost)

### 📱 Physical Device (iPhone or Android Phone)

The app needs to know your computer's IP address to connect to the backend:

1. **Find your computer's IP address:**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```
   Example output: `192.168.68.96`

2. **Edit `apps/mobile/config.ts`:**
   
   Uncomment the last line and add your IP:
   ```typescript
   // At the bottom of the file:
   export const API_BASE_URL = 'http://192.168.68.96:8000';  // Replace with YOUR IP
   ```

3. **Make sure:**
   - ✅ Phone and computer are on same WiFi network
   - ✅ Backend is running with `--host 0.0.0.0` (not just localhost)
   - ✅ No firewall blocking port 8000

4. **Run the app:**
   ```bash
   pnpm --filter mobile start
   # Scan QR code with Expo Go app
   ```

## Troubleshooting

### "Monte Carlo request failed" or "Network request failed"

This usually means the app can't reach the backend API.

#### Step 1: Verify Backend is Running
```bash
curl http://localhost:8000/healthz
# Should return: {"ok":true}
```

If not running:
```bash
cd projection/services/fastapi-calcs
uvicorn app:app --reload --host 0.0.0.0
```

**Important**: Use `--host 0.0.0.0` (not just `uvicorn app:app`) so the backend accepts connections from network devices!

#### Step 2: Check Your Platform

**Testing on iOS Simulator?**
- ✅ Should work automatically with localhost
- No config changes needed

**Testing on Android Emulator?**
- ✅ Should work automatically with 10.0.2.2
- No config changes needed

**Testing on Physical Device?**
- ⚠️ You MUST update `config.ts` with your computer's IP
- See "Physical Device" section above

#### Step 3: Test Backend from Terminal

```bash
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

Should return JSON with `success_probability`, `percentiles`, etc.

#### Step 4: Check Console Logs

The app logs requests and errors. In Expo:
1. Press `j` to open debugger
2. Look for "Monte Carlo Request:" and "Monte Carlo Error:" messages
3. Check the URL being used

### Missing Input Fields

The mobile app now includes all Monte Carlo inputs:
- ✅ Current Age, Retirement Age, Balance, Contribution, Expected Return (from deterministic section)
- ✅ Return Volatility
- ✅ Inflation
- ✅ Salary Growth
- ✅ Employer Match Rate
- ✅ Number of Paths
- ✅ Annual Fee
- ✅ Glidepath (toggle)
- ✅ Rebalance Annually (toggle)

### Backend URL Configuration

The app automatically selects the right URL based on your platform:

| Platform | URL | Configuration |
|----------|-----|---------------|
| iOS Simulator | `http://localhost:8000` | Automatic ✅ |
| Android Emulator | `http://10.0.2.2:8000` | Automatic ✅ |
| Physical Device | `http://YOUR_IP:8000` | Manual (update config.ts) |

## Development Commands

```bash
# Start mobile app
pnpm --filter mobile start

# Clear cache and restart
pnpm --filter mobile start -- --clear

# Run on specific platform
pnpm --filter mobile start
# Then press 'i' (iOS), 'a' (Android), or scan QR code

# View logs
# Expo will show logs in terminal automatically
```

## Production Deployment

For production, update `apps/mobile/config.ts`:

```typescript
const getApiBaseUrl = () => {
  if (!__DEV__) {
    return 'https://your-production-api.com';  // Update this!
  }
  // ... rest of development config
};
```
