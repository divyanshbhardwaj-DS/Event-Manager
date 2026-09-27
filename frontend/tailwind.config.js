/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#4F46E5',
          600: '#4338ca',
          700: '#3730a3',
        },
        accent: '#7C3AED',
        surface: '#FFFFFF',
        bgsoft: '#F8FAFC',
        ink: '#0F172A',
        muted: '#64748B',
        line: '#E2E8F0',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,.06), 0 8px 24px -12px rgba(79,70,229,.25)',
      },
      borderRadius: {
        xl2: '1rem',
      },
    },
  },
  plugins: [],
};
