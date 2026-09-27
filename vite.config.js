import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { bookingApiPlugin } from './server/vite-plugin-booking-api.js';

export default defineConfig({
  plugins: [react(), bookingApiPlugin()],
  server: {
    port: 5175,
    strictPort: true,
  },
});

