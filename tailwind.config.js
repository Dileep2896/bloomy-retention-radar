export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-paper)',
        foreground: 'var(--color-ink)',
        primary: 'var(--color-accent)',
      },
      fontFamily: { display: ['Fraunces', 'serif'], sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
};
