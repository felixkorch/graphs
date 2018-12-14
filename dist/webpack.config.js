var path = require('path');
module.exports = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    watch: true,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'xycharts.js',
        path: path.resolve(__dirname, 'dist')
    }
};
//# sourceMappingURL=webpack.config.js.map