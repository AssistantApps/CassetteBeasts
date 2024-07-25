module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'**/*.{html,wav,css,png,ico,webp,jpg,js,xml,txt,json}'
	],
	swDest: 'public/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/,
		/^standalone/
	]
};