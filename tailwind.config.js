/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ocre: {
          DEFAULT: '#C8973A',
          light: '#D4AA5A',
          dark: '#A07828',
          pale: '#FDF0DC',
        },
        kaki: {
          DEFAULT: '#3D4A2D',
          light: '#556040',
          dark: '#2B3520',
          pale: '#EEF0EA',
        },
        beige: {
          DEFAULT: '#EDE5D8',
          light: '#F7F3ED',
          dark: '#D5C9B5',
        },
        terre: '#2C2A26',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
