module.exports = {
  content: [
  './src/**/*.{html,ts}',
  './src/index.html'
],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EFF6FC',
          100: '#DCEBF8',
          200: '#B9D7F0',
          300: '#8BBDE5',
          400: '#5A9FD8',
          500: '#2F82C7',
          600: '#2369A8',
          700: '#1D5689',
          800: '#1A476F',
          900: '#163B5C',
        },
        ink: {
          50: '#F5F7FA',
          100: '#ECF0F4',
          200: '#D9E0E7',
          300: '#B5C1CC',
          400: '#8494A4',
          500: '#5A6B7C',
          700: '#3A4A5A',
          800: '#26333F',
          900: '#1B2733',
        },
        canvas: '#F3F6F9',
        success: {
          50: '#ECF8F1',
          100: '#D3EFDF',
          500: '#2BA160',
          600: '#1E8E4F',
          700: '#17703E',
        },
        warning: {
          50: '#FFF7E8',
          100: '#FDEBC8',
          500: '#E89B0C',
          600: '#C98200',
          700: '#8F5A00',
        },
        danger: {
          50: '#FDEFEF',
          100: '#FAD7D7',
          200: '#F3B4B4',
          500: '#D93B3B',
          600: '#C42B2B',
          700: '#A11F1F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        xs: '0 1px 2px rgba(16, 24, 40, 0.05)',
        card: '0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06)',
        overlay: '0 16px 40px -12px rgba(16, 24, 40, 0.28)',
        raised: '0 1px 2px rgba(16, 24, 40, 0.04), 0 4px 12px -2px rgba(16, 24, 40, 0.08)',
        lifted: '0 2px 4px rgba(16, 24, 40, 0.04), 0 12px 24px -6px rgba(16, 24, 40, 0.14)',
      },
    },
  },
};
