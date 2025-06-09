const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Create polyfills for Node.js modules that might be referenced
config.resolver.alias = {
  // Node.js polyfills
  stream: require.resolve('readable-stream'),
  util: path.resolve(__dirname, 'polyfills/empty.js'),
  crypto: require.resolve('react-native-get-random-values'),
  url: require.resolve('react-native-url-polyfill'),
  // Path aliases
  '@': path.resolve(__dirname, '.'),
};

module.exports = config; 