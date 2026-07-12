import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#06101d',
          900: '#0a1626',
          850: '#0d1d31',
          800: '#12233a',
          700: '#1d3554',
        },
        steel: {
          500: '#8ea3b8',
          300: '#c6d2df',
          100: '#edf4f8',
        },
        pulse: {
          cyan: '#2dd4bf',
          blue: '#38bdf8',
          green: '#6ee7b7',
          amber: '#f6c453',
          rose: '#fb7185',
          violet: '#a78bfa',
        },
      },
      boxShadow: {
        panel: '0 22px 80px rgba(0, 0, 0, 0.28)',
        glow: '0 0 0 1px rgba(45, 212, 191, 0.2), 0 20px 60px rgba(45, 212, 191, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      gridTemplateColumns: {
        dashboard: 'repeat(auto-fit, minmax(220px, 1fr))',
      },
    },
  },
  plugins: [],
};

export default config;
