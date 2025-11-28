/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F7F9F7',
          100: '#E8F2E8',
          200: '#D1E5D1',
          300: '#A8D0A8',
          400: '#7AB87A',
          500: '#5A9F5A',
          600: '#4A8B4A',
          700: '#3E733E',
          800: '#345E34',
          900: '#2A4E2A',
        },
        cream: {
          50: '#FDFCF8',
          100: '#F9F6F0',
          200: '#F5F1E8',
          300: '#F0EBDF',
          400: '#EBE6D6',
          500: '#E6E0CD',
        },
        gold: {
          400: '#F5D033',
          500: '#D4AF37',
          600: '#B8941F',
        },
        // 👇 Add these for Geist / shadcn UI compatibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
