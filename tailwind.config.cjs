/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			width: {
				'1/7': '14.28%'
			},
			maxHeight: {
				90: '90vh'
			}
		}
	},
	plugins: []
};
