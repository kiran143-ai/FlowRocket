const plugin = require('tailwindcss/plugin');

// Every colour, radius, shadow and font is a CSS variable (see src/styles.css), so the whole UI can
// switch between the Classic and Evergreen themes at runtime. Colour variables hold space-separated
// RGB channels so opacity modifiers such as `bg-brand-600/10` keep working.
const color = (name) => `rgb(var(--${name}) / <alpha-value>)`;
const scale = (name, steps) => Object.fromEntries(steps.map((s) => [s, color(`${name}-${s}`)]));

module.exports = {
  content: [
  './src/**/*.{html,ts}',
  './src/index.html'
],
  theme: {
    extend: {
      colors: {
        brand: scale('brand', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        ink: scale('ink', [50, 100, 200, 300, 400, 500, 700, 800, 900]),
        canvas: color('canvas'),
        success: scale('success', [50, 100, 500, 600, 700]),
        warning: scale('warning', [50, 100, 500, 600, 700]),
        danger: scale('danger', [50, 100, 200, 500, 600, 700]),
        info: scale('info', [50, 100, 200, 500, 700]),
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        card: 'var(--shadow-card)',
        overlay: 'var(--shadow-overlay)',
        raised: 'var(--shadow-raised)',
        lifted: 'var(--shadow-lifted)',
      },
    },
  },
  plugins: [
    // `eg:` applies a utility only while the Evergreen theme is active, e.g. `eg:rounded-md`.
    plugin(({ addVariant }) => {
      addVariant('eg', ':root[data-theme="evergreen"] &');
      // `blue:` applies only to the Evergreen layout in its Corporate Blue palette.
      addVariant('blue', ':root[data-theme="evergreen"][data-palette="blue"] &');
    }),
  ],
};
