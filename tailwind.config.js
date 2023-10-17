/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
        colors: {
            'blue':{
                A700: '#2962FF',
            }
        }
    },
  },
  plugins: [],
}

