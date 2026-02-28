import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        float: '0 10px 35px rgba(0,0,0,0.12)'
      }
    }
  },
  plugins: []
};

export default config;
