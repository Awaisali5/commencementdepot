import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: "camelCase", // Convert class names to camelCase
      generateScopedName: "[name]__[local]__[hash:base64:5]", // Generate unique class names
    },
    postcss: {
      plugins: [tailwindcss(), autoprefixer()], // PostCSS plugins for Tailwind and browser compatibility
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase chunk size warning threshold to 1 MB
    rollupOptions: {
      output: {
        manualChunks: {
          // Splitting vendors for optimization
          vendor: ["react", "react-dom", "react-router-dom"],
          // Splitting utilities
          utils: ["lodash", "axios"],
        },
        // Define naming conventions for build files
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
      external: [], // Specify external dependencies if required
    },
    sourcemap: true, // Generate source maps for debugging
    minify: "terser", // Use Terser for minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true, // Remove debugger statements in production
      },
    },
    assetsDir: "assets", // Directory for static assets
    emptyOutDir: true, // Clear output directory before building
  },
  resolve: {
    alias: {
      "@": "/src", // Alias for the `/src` directory
    },
  },
  server: {
    port: 3000, // Development server port
    open: true, // Automatically open the app in the browser
    cors: true, // Enable Cross-Origin Resource Sharing (CORS)
    hmr: {
      overlay: true, // Display errors as an overlay in the browser
    },
  },
  stats: true, // Enable detailed build statistics
});
