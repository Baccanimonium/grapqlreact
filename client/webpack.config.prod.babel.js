import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import base from './webpack.config.base';
import UglifyJsPlugin from'uglifyjs-webpack-plugin';
import MiniCssExtractPlugin from "mini-css-extract-plugin";

module.exports = merge.smart(base, {
	mode: "production",
	devtool: 'cheap-module-source-map',
    optimization: {
        minimizer: [
            new UglifyJsPlugin({ /* your config */ })
        ],
        nodeEnv: 'production',
        mangleWasmImports: true,
        removeAvailableModules: true,
    },

    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            }
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ],

});
