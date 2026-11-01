/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0B0F10',
        surface: '#12181A',
        'surface-2': '#1A2225',
        border: '#26323A',
        text: '#E8EEF0',
        muted: '#8FA1A8',
        primary: {
          DEFAULT: '#10B981',
          soft: '#6EE7B7',
          dark: '#059669'
        },
        warning: '#F59E0B',
        danger: '#F87171',
        info: '#38BDF8',
        rule: {
          r1: '#F59E0B',
          r2: '#38BDF8',
          r3: '#A78BFA'
        },
        device: {
          hvac: '#10B981',
          dishwasher: '#38BDF8',
          washer: '#A78BFA',
          vacuum: '#F59E0B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
      },
      borderRadius: {
        card: '12px'
      }
    },
  },
  plugins: [],
}

