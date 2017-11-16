const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

// target = process.env.TARGET || 'browser',

module.exports = {
	entry: {
		'app': './Source/App.js'
	},

	output: {
		path: path.resolve(__dirname, 'Output'),
		filename: '[name].js',

		// library: 'Samsara',
		// libraryTarget: 'window'
	},

	devtool: 'cheap-module-source-map',

	resolve: {
		alias: {
			// backbone: path.resolve('node_modules', 'backbone')
		}
	},

	module: {
		rules: [
			{
				test: /\.jsx?/,
				use: {
					loader: 'babel-loader'
				}
			},
			// {
			// 	test: /\.css$/,
			// 	use: [
			// 		'style-loader',
			// 		'css-loader',
			// 		'postcss-loader',
			// 	],
			// },
		]
	},

	// devServer: {
	// 	contentBase: path.resolve(__dirname, 'target', 'template'),
	// 	compress: false,
	// 	port: 3002,
	// 	lazy: true,
	// },
};