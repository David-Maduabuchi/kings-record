import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Expose server to your local network
    port: 5174, // Custom port
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // Ensure the path alias is correctly set
    },
  },
});
