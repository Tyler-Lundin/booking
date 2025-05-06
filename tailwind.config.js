// tailwind.config.js
module.exports = {
    darkMode: 'class', // enables class-based dark mode (not 'media')
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',   // or './src/**/*.{js,ts,jsx,tsx}' if you're using a src dir
      './components/**/*.{js,ts,jsx,tsx}',
      './app/**/*.{js,ts,jsx,tsx}',     // if you're using Next.js app directory
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  