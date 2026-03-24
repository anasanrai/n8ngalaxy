import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D0D14',
        surface: '#13131F',
        border: '#1E1E30',
        primary: {
          DEFAULT: '#7C3AED',
          hover: '#6D28D9',
        },
        accent: {
          DEFAULT: '#00E5C7',
          dim: '#00B8A0',
        },
        text: {
          primary: '#F4F4F8',
          secondary: '#9CA3AF',
          tertiary: '#6B7280',
        },
        danger: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        input: '8px',
        pill: '9999px',
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
