/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {}, /* ← シンプルな書き方 */
    autoprefixer: {},
  },
};

export default config;