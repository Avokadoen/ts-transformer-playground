const path = require('path');

const parameterTypeNamesTransformer = require('../transformer').default;

module.exports = ['ts-loader'].map(loader => ({
    mode: 'development',
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    resolve: {
        extensions: ['.ts', '.js' ],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader,
                exclude: /node_modules/,
                options: {
                    // make sure not to set `transpileOnly: true` here, otherwise it will not work
                    getCustomTransformers: program => ({
                        before: [
                            parameterTypeNamesTransformer(program)
                        ]
                    })
                }
            },
        ],
    },
}));