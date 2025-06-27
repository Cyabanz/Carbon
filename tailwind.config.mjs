/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      animation: {
        slideDown: 'slideDown 0.5s ease-out',
        float: 'float 20s infinite ease-in-out',
        fadeInUp: 'fadeInUp 1s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'spin-slower-reverse': 'spin 12s linear infinite reverse',
        'particle-float': 'particle-float 3s ease-out forwards',
      },
      keyframes: {
        slideDown: {
          'from': { transform: 'translateY(-100%)' },
          'to': { transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-30px) rotate(120deg)' },
          '66%': { transform: 'translateY(20px) rotate(240deg)' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'particle-float': {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-100px) scale(0)' },
        }
      }
    },
  },
  plugins: [],
}