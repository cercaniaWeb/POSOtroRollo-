/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'var(--bg-surface)',
          low: 'var(--bg-surface-low)',
          lowest: 'var(--bg-surface-lowest)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
          light: 'var(--color-primary-light)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          foreground: 'var(--color-success-foreground)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          foreground: 'var(--color-danger-foreground)',
        },
        foreground: {
          DEFAULT: 'var(--color-foreground)',
          muted: 'var(--color-foreground-muted)',
          subtle: 'var(--color-foreground-subtle)',
        },
      },
      borderRadius: {
        'xl': '20px',
        'lg': '15px',
        'md': '10px',
        '2xl': '28px',
      },
      boxShadow: {
        'neu': 'var(--shadow-neu)',
        'neu-sm': 'var(--shadow-neu-sm)',
        'neu-lg': 'var(--shadow-neu)',
        'neu-inset': 'var(--shadow-neu-inset)',
        'neu-inset-sm': 'var(--shadow-neu-inset-sm)',
        'neu-glow': 'var(--shadow-neu-glow)',
        'neu-glow-success': 'var(--shadow-neu-glow-success)',
        'neu-glow-danger': 'var(--shadow-neu-glow-danger)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.2, 0, 0, 1)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
