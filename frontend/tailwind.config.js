/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Stitch Design System — Aries Ventures "Structured Fluidity"
        "primary": "#000101",
        "primary-container": "#1a1c1e",
        "on-primary": "#ffffff",
        "on-primary-container": "#838486",
        "primary-fixed": "#e2e2e5",
        "primary-fixed-dim": "#c6c6c9",
        "on-primary-fixed": "#1a1c1e",
        "on-primary-fixed-variant": "#454749",
        "inverse-primary": "#c6c6c9",

        "secondary": "#0058be",
        "secondary-container": "#2170e4",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#fefcff",
        "secondary-fixed": "#d8e2ff",
        "secondary-fixed-dim": "#adc6ff",
        "on-secondary-fixed": "#001a42",
        "on-secondary-fixed-variant": "#004395",

        "tertiary": "#000104",
        "tertiary-container": "#0c1d30",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#75859d",
        "tertiary-fixed": "#d3e4fe",
        "tertiary-fixed-dim": "#b7c8e1",
        "on-tertiary-fixed": "#0b1c30",
        "on-tertiary-fixed-variant": "#38485d",

        "surface": "#f8f9fa",
        "surface-dim": "#d9dadb",
        "surface-bright": "#f8f9fa",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f4f5",
        "surface-container": "#edeeef",
        "surface-container-high": "#e7e8e9",
        "surface-container-highest": "#e1e3e4",
        "surface-variant": "#e1e3e4",
        "surface-tint": "#5d5e61",
        "inverse-surface": "#2e3132",
        "inverse-on-surface": "#f0f1f2",

        "on-surface": "#191c1d",
        "on-surface-variant": "#44474a",
        "on-background": "#191c1d",
        "background": "#f8f9fa",

        "outline": "#75777a",
        "outline-variant": "#c5c6ca",

        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        "scrim": "#000000",
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "2xl": "2rem",
        "3xl": "3rem",
      },
      fontFamily: {
        "headline": ["'Plus Jakarta Sans'", "sans-serif"],
        "body": ["'Inter'", "sans-serif"],
        "label": ["'Inter'", "sans-serif"],
        "sans": ["'Inter'", "sans-serif"],
        "mono": ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'text-red-500',
    'text-blue-500',
    'text-green-500',
    'text-blue-600',
    'text-green-600',
    'border-blue-600',
    'bg-blue-600',
    'bg-green-600',
    'bg-red-600',
  ],
}
