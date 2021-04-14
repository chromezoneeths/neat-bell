module.exports = {
	optimize: {
		bundle: true,
		minify: true,
		target: 'esnext'
	},
	exclude: [
		'**/node_modules/**/*',
		'**/tsconfig.json',
		'**/package*.json',
		'**/*.config.js'
	]
};

