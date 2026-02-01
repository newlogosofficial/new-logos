/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, /* ← ここが変わります */
    autoprefixer: {},
  },
};

export default config;