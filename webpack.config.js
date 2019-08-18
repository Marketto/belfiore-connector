const path = require('path');

module.exports = {
    entry: './src/belfiore-connector.js',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'belfiore-connector.min.js',
        library: 'belfioreConnector',
        libraryTarget: 'umd',
        globalObject: 'typeof self !== \'undefined\' ? self : this'
    }
};