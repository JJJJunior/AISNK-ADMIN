import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    https: {
      key: fs.readFileSync("C:\\192.168.0.104-key.pem"),
      cert: fs.readFileSync("C:\\192.168.0.104.pem"),
    },
  },
  plugins: [react()],
});
