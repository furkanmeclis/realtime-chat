const rewirePostCSSNested = require('react-app-rewire-postcss-nested');
module.exports = {
    webpack: function(config, env) {
        config.optimization.splitChunks = {
            cacheGroups: {
               default: false
            }
        };
        config.optimization.runtimeChunk = false;
        return config;
    },
    override: function (config, env) {
        config = rewirePostCSSNested(config, env);
        return config;
      }
}