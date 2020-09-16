module.exports = function override(config, env) {
    config.output = {
        ...config.output, // copy all settings
        filename: "script/js/main.b9c32e2c.chunk.js",
        chunkFilename: "script/js/2.e77167bf.chunk.js",
    };

    config.optimization.splitChunks = {
        cacheGroups: {
            default: false,
        },
    };

    config.optimization.runtimeChunk = false;

    // Renames main.b100e6da.css to main.css
    config.plugins[5].options.filename = 'script/css/main.b487e68a.chunk.css';
    config.plugins[5].options.moduleFilename = () => 'script/css/main.b487e68a.chunk.css';

    return config;
};