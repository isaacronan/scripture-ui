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
                    exclude: /node_modules/,
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
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Web App'
            }),
            new MiniCssExtractPlugin({
                filename: '[hash].styles.css'
            })
        ],
        devServer: {
            port: 8000,
            hot: true
        }
    }
};