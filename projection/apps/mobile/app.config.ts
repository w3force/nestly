import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const {
    orientation: _orientation,
    icon: _icon,
    scheme: _scheme,
    userInterfaceStyle: _userInterfaceStyle,
    splash: _splash,
    ios: _ios,
    android: _android,
    plugins: _plugins,
    ...rest
  } = config ?? {};

  return {
    ...rest,
    name: 'Nestly',
    slug: 'nestly',
    version: '1.0.0',
    assetBundlePatterns: ['**/*'],
    updates: {
      fallbackToCacheTimeout: 0
    },
    runtimeVersion: {
      policy: 'sdkVersion'
    }
  };
};
