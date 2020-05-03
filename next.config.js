module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config

    // Remove to get IE11 compatibility:
    config.resolve.alias.mobx =__dirname + "/node_modules/mobx/lib/mobx.es6.js";
    return config;
  }
};