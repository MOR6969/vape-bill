import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Using standard hex colors instead of oklch
        primary: '#3b82f6', // blue-500
        secondary: '#10b981', // emerald-500
        accent: '#8b5cf6', // violet-500
      },
    },
  },
  plugins: [],
};

export default config; 