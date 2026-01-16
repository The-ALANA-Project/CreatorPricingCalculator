import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Plugin to handle figma:asset imports during build
function figmaAssetPlugin() {
  const PREFIX = 'figma:asset/';
  return {
    name: 'figma-asset-plugin',
    enforce: 'pre' as const, // Run before other plugins
    resolveId(id: string) {
      if (id.startsWith(PREFIX)) {
        // Return a resolved virtual module ID
        return '\0' + id; // \0 prefix marks it as virtual module
      }
    },
    load(id: string) {
      if (id.startsWith('\0' + PREFIX)) {
        // Return inline SVG logo as data URL
        const logo = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='60' viewBox='0 0 200 60'%3E%3Ctext x='10' y='40' font-family='Work Sans, sans-serif' font-size='24' font-weight='700' fill='%23131718'%3ECreator Pricing%3C/text%3E%3C/svg%3E`;
        return `export default "${logo}"`;
      }
    }
  };
}

// Plugin to download and save favicon and OG image from GitHub
function downloadPublicAssetsPlugin() {
  return {
    name: 'download-public-assets',
    async buildStart() {
      const publicDir = path.resolve(__dirname, 'public');
      
      // Ensure public directory exists
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      
      const assets = [
        {
          url: 'https://github.com/user-attachments/assets/efeaa686-8807-48c4-a683-24c80ccf15fc',
          filename: 'favicon.png'
        },
        {
          url: 'https://github.com/user-attachments/assets/59ec8fc5-0c9c-4b4e-9b65-28542399c7f9',
          filename: 'og-image.png'
        }
      ];
      
      console.log('📥 Downloading public assets...');
      
      for (const asset of assets) {
        try {
          const response = await fetch(asset.url);
          if (!response.ok) {
            console.warn(`⚠️  Failed to download ${asset.filename}: ${response.status}`);
            continue;
          }
          
          const buffer = await response.arrayBuffer();
          const filePath = path.join(publicDir, asset.filename);
          fs.writeFileSync(filePath, Buffer.from(buffer));
          console.log(`✅ Downloaded ${asset.filename} (${buffer.byteLength} bytes)`);
        } catch (error) {
          console.error(`❌ Error downloading ${asset.filename}:`, error);
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [
    downloadPublicAssetsPlugin(), // Download assets before build
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
  // Explicitly configure the public directory
  publicDir: 'public',
})