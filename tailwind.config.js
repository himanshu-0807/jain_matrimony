/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                saffron: {
                    DEFAULT: '#FF9933',
                    light: '#FFB366',
                    dark: '#E68A2E',
                },
                gold: {
                    DEFAULT: '#FFD700',
                    light: '#FFF8DC',
                    dark: '#DAA520',
                },
                jain: {
                    red: '#DC2626',
                    cream: '#FFFBF0',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
