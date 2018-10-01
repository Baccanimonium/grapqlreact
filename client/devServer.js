'use strict';

import webpack from 'webpack';
import WebpackDevServer from'webpack-dev-server';

import webpackConfig from './webpack.config.dev';
import base from './webpack.config.base';

const options = {
	host: 'localhost',
	port: '4000',

	contentBase: base.output.path,
	historyApiFallback: true,
	hot: true,
	publicPath: base.output.publicPath,
	headers: {
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Credentials': 'true',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Content-Type, *',
	},
	stats: { colors: true },
    proxy: {
        '/api': 'http://localhost:5000',
        // '/graphql': 'http://localhost:5000'
    }

};

WebpackDevServer.addDevServerEntrypoints(webpackConfig, options);

new WebpackDevServer(webpack(webpackConfig), options).listen(4000, 'localhost', (error) => {
	if (error) {
		console.log(error); // eslint-disable-line no-console
	}

	console.log(`Listening at localhost:3000.`); // eslint-disable-line no-console
});
