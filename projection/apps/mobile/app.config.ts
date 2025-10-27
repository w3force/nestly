import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Nestly',
  slug: 'nestly',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon3.png',
  userInterfaceStyle: 'automatic',
  scheme: 'nestly',
  splash: {
    image: './assets/icon3.png',
    resizeMode: 'contain',
    backgroundColor: '#4ABDAC'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.w3force.nestly',
    buildNumber: '1',
    infoPlist: {
      NSCameraUsageDescription: 'Nestly does not use the camera.',
      NSPhotoLibraryUsageDescription: 'Nestly does not access your photo library.'
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/icon3.png',
      backgroundColor: '#4ABDAC'
    },
    package: 'com.w3force.nestly',
    versionCode: 1,
    permissions: []
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro'
  },
  plugins: [
    'expo-asset',
    'expo-font'
  ],
  updates: {
    fallbackToCacheTimeout: 0
  },
  runtimeVersion: {
    policy: 'sdkVersion'
  }
});
