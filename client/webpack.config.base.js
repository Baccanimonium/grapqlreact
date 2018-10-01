import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from "mini-css-extract-plugin";

module.exports = {
	entry: ["babel-polyfill", "./src/index.js"],
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist/'),
		publicPath: '/'
	},
	module: {
		rules:[
			{
				test: /\.json$/,
				type: 'javascript/auto',
				use: [require.resolve('json-loader')],
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: "html-loader"
					}
				]
			},

			{
				test: /\.(png|svg|jpg|gif|ico)$/,
				use: [
					'file-loader'
				]
			},
			{
				test: /\.svg$/,
				loaders: [
					{
						loader: 'svg-url-loader',
						options: {
							limit: 10 * 1024,
							name: '[path][name].[hash].[ext]',
						},
					},
					{ loader: 'image-webpack-loader' },
				],
			},
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html",
			filename: "./index.html"
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css"
		}),
	],
};
