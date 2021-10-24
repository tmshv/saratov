const path = require('path');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
	context: __dirname,
	output: {
		path: path.resolve(__dirname, 'build'),
	},
	plugins: [
		new UglifyJsPlugin(),
	]
});
