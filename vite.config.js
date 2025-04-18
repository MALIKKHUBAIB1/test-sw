// vite.config.js
export default {
  root: "./public", // this tells Vite to use 'public' as the root folder
  server: {
    port: 5173, // Port for local server
  },
  build: {
    outDir: "./dist", // Output folder after build
  },
};
