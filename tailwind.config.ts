import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e8eef5',
          100: '#c5d4e3',
          500: '#1a3a5c',
          700: '#0d2d4a',
          800: '#0a2342',
          900: '#061828',
        },
        gold: {
          300: '#e8c96a',
          400: '#d4af37',
          500: '#c8a951',
          600: '#b8961a',
        },
        court: {
          green: '#2d5a27',
          blue: '#1e5c8e',
          surface: '#3d7ec8',
        },
      },
    },
  },
  plugins: [],
}
export default config
