const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch folders for monorepo
config.watchFolders = [
  workspaceRoot,
];

// Node modules to watch in the workspace
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

const reactPath = path.join(projectRoot, 'node_modules/react');
const reactJsxRuntimePath = path.join(projectRoot, 'node_modules/react/jsx-runtime');
const reactJsxDevRuntimePath = path.join(projectRoot, 'node_modules/react/jsx-dev-runtime');
const reactNativePath = path.join(projectRoot, 'node_modules/react-native');

config.resolver.alias = {
  ...(config.resolver.alias ?? {}),
  react: reactPath,
  'react-native': reactNativePath,
  'react/jsx-runtime': reactJsxRuntimePath,
  'react/jsx-dev-runtime': reactJsxDevRuntimePath,
  '@projection/shared': path.resolve(workspaceRoot, 'packages/shared/src'),
  '@projection/core': path.resolve(workspaceRoot, 'packages/core/src'),
  '@projection/api-client': path.resolve(workspaceRoot, 'packages/api-client/src'),
};

config.resolver.extraNodeModules = new Proxy({}, {
  get: (_target, name) => {
    if (name === 'react') return reactPath;
    if (name === 'react-native') return reactNativePath;
    if (name === 'react/jsx-runtime') return reactJsxRuntimePath;
    if (name === 'react/jsx-dev-runtime') return reactJsxDevRuntimePath;
    
    // Handle workspace packages
    if (name === '@projection/shared') {
      return path.resolve(workspaceRoot, 'packages/shared/src');
    }
    if (name === '@projection/core') {
      return path.resolve(workspaceRoot, 'packages/core/src');
    }
    if (name === '@projection/api-client') {
      return path.resolve(workspaceRoot, 'packages/api-client/src');
    }
    
    return path.join(projectRoot, 'node_modules', name);
  },
});

module.exports = config;
