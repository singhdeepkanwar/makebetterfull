/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        background: '#020617', /* Slate 950 */
        surface: '#0F172A',    /* Slate 900 */
        surfaceHighlight: '#1E293B', /* Slate 800 */
        primary: '#3B82F6',    /* Blue 500 */
        primaryDark: '#2563EB', /* Blue 600 */
        textMuted: '#94A3B8',  /* Slate 400 */
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'scroll': 'scroll 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}