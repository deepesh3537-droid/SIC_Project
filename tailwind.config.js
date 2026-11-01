/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        'surface-elevated': 'var(--surface-elevated)',
        border: 'var(--border)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        primary: {
          DEFAULT: 'var(--primary)',
          soft: 'var(--primary-soft)',
          dark: 'var(--primary-dark)',
          hover: 'var(--primary-soft)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          soft: 'var(--secondary-soft)',
        },
        ai: {
          DEFAULT: 'var(--ai)',
          soft: 'var(--ai-soft)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        info: 'var(--info)',
        rule: {
          r1: 'var(--rule-r1)',
          r2: 'var(--rule-r2)',
          r3: 'var(--rule-r3)',
        },
        device: {
          hvac: 'var(--device-hvac)',
          dishwasher: 'var(--device-dishwasher)',
          washer: 'var(--device-washer)',
          vacuum: 'var(--device-vacuum)',
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
