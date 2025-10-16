const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = Array.from(new Set([
  ...(config.watchFolders ?? []),
  workspaceRoot,
]));


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
};

config.resolver.extraNodeModules = new Proxy({}, {
  get: (_target, name) => {
    if (name === 'react') return reactPath;
    if (name === 'react-native') return reactNativePath;
    if (name === 'react/jsx-runtime') return reactJsxRuntimePath;
    if (name === 'react/jsx-dev-runtime') return reactJsxDevRuntimePath;
    return path.join(projectRoot, 'node_modules', name);
  },
});

module.exports = config;
