import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        gradleaf: {
          50: '#f4f8f4',
          100: '#e5eee5',
          200: '#cddfcd',
          300: '#a3c4a3',
          400: '#5c946e',
          500: '#274d36',
          600: '#1e3c2b',
          700: '#173022',
          800: '#12261b',
          900: '#0c1a12',
          950: '#060d09',
          forest: '#142d1f',
          deep: '#0c1a12',
          sage: '#edf4ec',
          chalk: '#f7faf8',
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(20, 45, 31, 0.05), 0 2px 8px 0 rgba(0, 0, 0, 0.04), inset 0 1px 1px 0 rgba(255, 255, 255, 0.8)',
        'glass-card': '0 10px 30px -10px rgba(20, 45, 31, 0.07), 0 4px 12px -2px rgba(0, 0, 0, 0.03), inset 0 1px 0 0 rgba(255, 255, 255, 0.85)',
        'tactile': '0 4px 14px 0 rgba(26, 56, 38, 0.28), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
        'tactile-dark': '0 4px 14px 0 rgba(12, 26, 18, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        'tactile-subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03), inset 0 1px 0 0 rgba(255, 255, 255, 0.95)',
        'neu-flat': '6px 6px 16px rgba(0, 0, 0, 0.03), -6px -6px 16px rgba(255, 255, 255, 0.9)',
        'neu-inset': 'inset 2px 2px 5px rgba(0, 0, 0, 0.04), inset -2px -2px 5px rgba(255, 255, 255, 0.8)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
export default config;
