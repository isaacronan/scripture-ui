require('dotenv').config()
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
    const isProduction = env && env.production;
    
    return {
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? '' : 'eval-source-map',
        entry: './index.js',
        output: {
            filename: '[hash].bundle.js',
            path: path.resolve(__dirname, 'dist')
        },
        module: {
            rules: [
                {
                    test: /\.svelte$/,
                    include: path.resolve(__dirname, 'src'),
                    use: {
                        loader: 'svelte-loader',
                        options: {
                            emitCss: true
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        isProduction ? {
                            loader: MiniCssExtractPlugin.loader,
                        } : 'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: isProduction ? false : true
                            }
                        }
                    ]
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/i,
                    use: 'url-loader'
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Scripture'
            }),
            new MiniCssExtractPlugin({
                filename: '[hash].styles.css'
            })
        ],
        devServer: {
            port: 8000,
            hot: true,
            proxy: [{
                context: ['/api', '/stats'],
                target: process.env.PROXY,
                secure: false
            }]
        }
    }
};