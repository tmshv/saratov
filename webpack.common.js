const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// const ExtractTextPlugin = require('extract-text-webpack-plugin');

// The path to the cesium source code
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';

module.exports = {
	context: __dirname,
	entry: {
		app: './Source/app.js'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'Output'),

		// Needed by Cesium for multiline strings
		sourcePrefix: ''
	},
	amd: {
		// Enable webpack-friendly use of require in cesium
		toUrlUndefined: true
	},
	node: {
		// Resolve node module use of fs
		fs: "empty"
	},
	resolve: {
		alias: {
			// Cesium module name
			cesium: path.resolve(__dirname, cesiumSource)
		}
	},
	module: {
		rules: [
			{
				test: /\.jsx?/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader'
				}
			},
			// {
			// 	test: /\.css$/,
			// 	use: ExtractTextPlugin.extract('style-loader', 'css-loader'),
			// },
			// {
			// 	test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
			// 	use: ['url-loader']
			// }
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'Source/index.html'
		}),

		new CopyWebpackPlugin([
			{from: 'Source/index.css', to: ''}
		]),

		new CopyWebpackPlugin([
			{from: 'config.json', to: ''}
		]),

		new CopyWebpackPlugin([
			{from: 'ThirdParty', to: 'ThirdParty'}
		]),

		new CopyWebpackPlugin([
			{from: 'Resources', to: 'Resources'}
		]),

		// Copy Cesium Assets, Widgets, and Workers to a static directory
		new CopyWebpackPlugin([{from: path.join(cesiumSource, cesiumWorkers), to: 'Workers'}]),
		new CopyWebpackPlugin([{from: path.join(cesiumSource, 'Assets'), to: 'Assets'}]),
		new CopyWebpackPlugin([{from: path.join(cesiumSource, 'Widgets'), to: 'Widgets'}]),

		new webpack.DefinePlugin({
			// Define relative base path in cesium for loading assets
			CESIUM_BASE_URL: JSON.stringify('')
		}),

		// Split cesium into a seperate bundle
		new webpack.optimize.CommonsChunkPlugin({
			name: 'cesium',
			minChunks: function (module) {
				return module.context && module.context.indexOf('cesium') !== -1;
			}
		}),

		// new ExtractTextPlugin('style.css'),
	],
};