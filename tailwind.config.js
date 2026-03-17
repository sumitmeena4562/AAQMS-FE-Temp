export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    // ADD THIS LINE
    important: true,
    theme: {
        extend: {
            fontFamily: {
                inter: ['Inter', 'sans-serif'], // Use 'inter' specifically
            },
            boxShadow: {
                'figma': '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
                'card': '0px 2px 18px -2px #10224F60',
            }
        },
    },
};