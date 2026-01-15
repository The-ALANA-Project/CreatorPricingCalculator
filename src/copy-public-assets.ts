// This script imports the Figma assets and will be used by the build process
// to copy them to the public folder

// Import the actual images from Figma
import ogImageUrl from 'figma:asset/47f7f8fe805cf72b0bdf4b16e8f382c1ae284f85.png';
import faviconUrl from 'figma:asset/a18bfca0746eb40f9a9b830804922d6969e93cd6.png';

export async function copyPublicAssets() {
  try {
    // Fetch the images as blobs
    const ogResponse = await fetch(ogImageUrl);
    const ogBlob = await ogResponse.blob();
    
    const faviconResponse = await fetch(faviconUrl);
    const faviconBlob = await faviconResponse.blob();
    
    console.log('Assets loaded successfully');
    console.log('OG Image size:', ogBlob.size);
    console.log('Favicon size:', faviconBlob.size);
    
    return {
      ogImage: ogBlob,
      favicon: faviconBlob
    };
  } catch (error) {
    console.error('Error loading assets:', error);
    return null;
  }
}

// Export the URLs for reference
export const assetUrls = {
  ogImage: ogImageUrl,
  favicon: faviconUrl
};
