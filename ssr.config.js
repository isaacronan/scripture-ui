const path = require('path');

module.exports = () => {
    return {
        mode: 'production',
        entry: './src/App.svelte',
        output: {
            filename: 'scripture-ssr.js',
            path: path.resolve(__dirname, 'dist'),
            libraryExport: 'default',
            libraryTarget: 'commonjs'
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
                                css: false,
                                generate: 'ssr',
                                hydratable: true
                            }
                        }
                    }
                }
            ]
        }
    }
};