export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {

                'figma': '0px 4px 4px rgba(0, 0, 0, 0.25)',
            }
        },
    },
};