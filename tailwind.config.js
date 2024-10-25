/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,ts}'],
    theme: {
        extend: {},
    },
    plugins: [
        require('daisyui'),
        function ({ addUtilities }) {
            const newUtilities = {
                '.scrollbar-hide': {
                    '-ms-overflow-style': 'none' /* IE */,
                    'scrollbar-width': 'none' /* Firefox */,
                },
                '.scrollbar-hide::-webkit-scrollbar': {
                    display: 'none' /* Chrome, Safari */,
                },
            };
            addUtilities(newUtilities);
        },
    ],
    daisyui: {
        themes: ['light', 'night'],
    },
};
