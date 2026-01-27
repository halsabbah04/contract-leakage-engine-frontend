/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors - Professional Design System inspired by KPMG
        primary: {
          DEFAULT: '#1a237e',  // Deep blue (PRIMARY_BLUE)
          hover: '#0d1b2a',    // Darker for hover states
          light: '#1976d2',    // Lighter for accents (ACCENT_BLUE)
          dark: '#0d1b2a',     // Very dark blue (DARK_NAVY)
        },
        // Severity colors with light variants
        severity: {
          critical: '#d32f2f',
          'critical-light': '#ffebee',
          high: '#f57c00',
          'high-light': '#fff9e6',
          medium: '#fbc02d',
          'medium-light': '#fffde7',
          low: '#388e3c',
          'low-light': '#e8f5e9',
        },
        // Semantic colors
        success: {
          DEFAULT: '#00853f',
          light: '#e8f5e9',
        },
        error: {
          DEFAULT: '#da291c',
          light: '#ffebee',
        },
        // Neutral colors for borders, backgrounds
        neutral: {
          light: '#f5f5f5',
          medium: '#e0e0e0',
          dark: '#9e9e9e',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.08)',
        'primary': '0 4px 14px 0 rgba(26, 35, 126, 0.15)',
      },
    },
  },
  plugins: [],
};
