import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const publicDir = path.resolve(__dirname, '../public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('📥 Downloading public assets...');

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        return downloadFile(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✅ Downloaded ${path.basename(filepath)}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

async function downloadAssets() {
  for (const asset of assets) {
    const filepath = path.join(publicDir, asset.filename);
    try {
      await downloadFile(asset.url, filepath);
    } catch (error) {
      console.error(`❌ Error downloading ${asset.filename}:`, error.message);
      process.exit(1);
    }
  }
  console.log('🎉 All assets downloaded successfully!');
}

downloadAssets();
