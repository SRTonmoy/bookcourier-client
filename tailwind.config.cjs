// tailwind.config.js - UPDATED
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary, #0ea5a4)',
        secondary: 'var(--color-secondary, #6366f1)',
        accent: 'var(--color-accent, #f59e0b)',
        base: {
          DEFAULT: 'var(--bg-base, #ffffff)',
          100: 'var(--bg-base-100, #f9fafb)',
          200: 'var(--bg-base-200, #f3f4f6)',
          300: 'var(--bg-base-300, #e5e7eb)',
        }
      },
      animation: {
        'theme-switch': 'themePulse 0.5s ease-in-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        themePulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: '#0ea5a4',
          secondary: '#6366f1',
          accent: '#f59e0b',
          'base-100': '#ffffff',
          'base-200': '#f9fafb',
          'base-300': '#f3f4f6',
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: '#0ea5a4',
          secondary: '#818cf8',
          accent: '#f59e0b',
          'base-100': '#111827',
          'base-200': '#1f2937',
          'base-300': '#374151',
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: false,
  },
};