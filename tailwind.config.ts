import type { Config } from 'tailwindcss'
export default {
  content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        fintech: {
          bg: '#F7FAFD',
          text: '#0A2540',
          muted: '#5B6B7C',
          accent: '#22D3EE',
          accent2: '#6366F1'
        }
      }
    }
  },
  plugins: [],
} satisfies Config;
