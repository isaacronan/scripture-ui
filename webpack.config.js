require('dotenv').config()
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
    const isProduction = !!env.production;
    const { API_SERVER = 'http://localhost:8001', STATS_SERVER = '' } = process.env;
    const PUBLIC_PATH = '/scripture/';
    
    return {
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? false : 'eval-source-map',
        entry: './index.js',
        output: {
            filename: '[fullhash].bundle.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: PUBLIC_PATH
        },
        module: {
            rules: [
                {
                    test: /\.svelte$/,
                    include: path.resolve(__dirname, 'src'),
                    use: {
                        loader: 'svelte-loader',
                        options: {
                            compilerOptions: {
                                dev: !isProduction,
                                hydratable: true
                            },
                            emitCss: isProduction,
                            hotReload: !isProduction
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        isProduction ? {
                            loader: MiniCssExtractPlugin.loader
                        } : 'style-loader',
                        {
                            loader: 'css-loader'
                        }
                    ]
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[hash][ext][query]'
                    }
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Scripture',
                filename: isProduction ? 'scripture.html' : 'index.html'
            }),
            new MiniCssExtractPlugin({
                filename: '[fullhash].styles.css'
            })
        ],
        devServer: {
            port: 8000,
            hot: true,
            historyApiFallback: {
                rewrites: [
                    { from: /\/scripture(\/.*)?$/, to: PUBLIC_PATH }
                ]
            },
            proxy: [
                {
                    context: ['/scripture/api'],
                    target: API_SERVER,
                    secure: false
                },
                {
                    context: ['/stats'],
                    target: STATS_SERVER,
                    secure: false
                }
            ]
        }
    }
};