import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/upload_resume": "http://127.0.0.1:5000",
      "/start_interview": "http://127.0.0.1:5000",
      "/next_question": "http://127.0.0.1:5000",
      "/submit_answer": "http://127.0.0.1:5000",
      "/report": "http://127.0.0.1:5000",
      "/health": "http://127.0.0.1:5000",
    },
  },
});