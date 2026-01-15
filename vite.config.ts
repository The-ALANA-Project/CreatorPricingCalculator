import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Plugin to handle figma:asset imports and copy specific ones to public
function figmaAssetPlugin() {
  const PREFIX = 'figma:asset/';
  
  // Specific assets we need to handle for public folder
  const PUBLIC_ASSETS: Record<string, { name: string; data: string }> = {};
  
  return {
    name: 'figma-asset-plugin',
    enforce: 'pre' as const,
    
    resolveId(id: string) {
      if (id.startsWith(PREFIX)) {
        return '\0' + id;
      }
    },
    
    load(id: string) {
      if (id.startsWith('\0' + PREFIX)) {
        const assetId = id.replace('\0' + PREFIX, '');
        
        // Check if this is the OG image or favicon
        if (assetId === '47f7f8fe805cf72b0bdf4b16e8f382c1ae284f85.png') {
          // This is the OG image - return a reference to the public path
          // In dev, return a placeholder; in build, it will be in /public
          return `export default "/og-image.png"`;
        } else if (assetId === 'a18bfca0746eb40f9a9b830804922d6969e93cd6.png') {
          // This is the favicon - return a reference to the public path
          return `export default "/favicon.png"`;
        }
        
        // For other assets, return a placeholder
        const logo = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='60' viewBox='0 0 200 60'%3E%3Ctext x='10' y='40' font-family='Work Sans, sans-serif' font-size='24' font-weight='700' fill='%23131718'%3ECreator Pricing%3C/text%3E%3C/svg%3E`;
        return `export default "${logo}"`;
      }
    },
    
    configureServer(server) {
      // In dev mode, serve the assets from a virtual endpoint
      server.middlewares.use((req, res, next) => {
        if (req.url === '/og-image.png' || req.url === '/favicon.png') {
          // In dev, these won't exist yet, so return a placeholder
          res.writeHead(200, { 'Content-Type': 'image/png' });
          res.end();
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [
    figmaAssetPlugin(), // Must be before react plugin
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
})