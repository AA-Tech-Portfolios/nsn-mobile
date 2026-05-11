const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);
const navigationNativeRoot = path.dirname(require.resolve("@react-navigation/native/package.json"));

const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "@react-navigation/native" || moduleName.startsWith("@react-navigation/native/")) {
    const target =
      moduleName === "@react-navigation/native"
        ? navigationNativeRoot
        : path.join(navigationNativeRoot, moduleName.slice("@react-navigation/native/".length));

    return context.resolveRequest(context, target, platform);
  }

  return defaultResolveRequest
    ? defaultResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, {
  input: "./global.css",
  // Force write CSS to file system instead of virtual modules
  // This fixes iOS styling issues in development mode
  forceWriteFileSystem: true,
});
