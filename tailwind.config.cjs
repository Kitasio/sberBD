module.exports = {
	mode: 'jit',
	purge: ['./src/**/*.svelte'],
	theme: {
		extend: {
			fontFamily: {
				mont: 'Montserrat'
			},
			colors: {
				'green': '#69D640',
				'yellow': '#a3e301',
			}
		}
	},
	variants: {
		extend: {
			gradientColorStops: ['hover']
		}
	},
	plugins: [
		require('@tailwindcss/forms')
	]
};
