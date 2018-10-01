import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import base from './webpack.config.base.js';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from "mini-css-extract-plugin";

module.exports = merge.smart(base, {
	mode: "development",
	devtool: 'cheap-module-source-map',
	plugins: [
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
	],
	module:{
		rules:[
            {
                test: /\.css$/,
                use: ["style-loader" ,"css-loader"]
            }
		]

	}
});
