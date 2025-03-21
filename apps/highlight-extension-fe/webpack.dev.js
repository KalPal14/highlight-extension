/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const { merge } = require('webpack-merge');
const Dotenv = require('dotenv-webpack');

const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'cheap-module-source-map',
	plugins: [
		new Dotenv({
			path: '../../.env.dev',
			systemvars: true,
		}),
	],
});
