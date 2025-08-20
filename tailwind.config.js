/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontFamily: {
                karla: ["Karla", "sans-serif"],
                "karla-bold": ["Karla-Bold", "sans-serif"],
                "karla-italic": ["Karla-Italic", "sans-serif"],
            },
            colors: {
              logo: '#FFF065',
              primaryw: '#FFFFFF',
              primaryb: '#000000',
              secondary: '#39168C',


            }
        },
    },
    plugins: [],
}
