import { Platform } from 'react-native';

// API configuration
// iOS Simulator: Use localhost
// Android Emulator: Use 10.0.2.2 (special alias for host machine)
// Physical Device: Use your computer's IP address (e.g., http://192.168.68.96:8000)

const getApiBaseUrl = () => {
  if (!__DEV__) {
    return 'https://your-production-api.com';
  }

  // Development mode
  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    // For physical Android device, replace with your computer's IP: http://192.168.68.96:8000
    return 'http://10.0.2.2:8000';
  }

  // iOS Simulator can use localhost
  // For physical iOS device, replace with your computer's IP: http://192.168.68.96:8000
  return 'http://192.168.68.96:8000'
};

export const API_BASE_URL = getApiBaseUrl();

// If you're testing on a PHYSICAL device (iPhone or Android phone), uncomment and update:
// export const API_BASE_URL = 'http://192.168.68.96:8000';  // Your computer's IP
