const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './assets/js/script.js',
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, 'build'),
    },
    devServer: {
        static: './',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    devtool: "source-map",
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html', // wskazuję plik źródłowy filename: 'index.html'
            // określam nazwę dla pliku
        })
    ]
};
