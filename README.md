# Creator Pricing Calculator

A free pricing calculator for creators and creative freelancers that converts your monthly or annual expenses into a baseline rate.

## Features

- Calculate floor pricing based on expenses and business costs
- Apply tax rate, emergency buffer, and reinvestment percentages
- View pricing across multiple service types (hourly, project-based, day rates, retainers)
- Export results as PNG, PDF, or JSON
- Import previous calculations from JSON
- Mobile-optimized with liquid glass aesthetic

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- Radix UI components
- Motion (Framer Motion)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

This app is configured for Netlify deployment:

1. Push changes to your GitHub repository
2. Netlify will automatically build and deploy
3. Build command: `npm run build`
4. Publish directory: `dist`

### ⚠️ IMPORTANT: Adding Favicon and OG Image

After deploying, you need to manually add these files to your GitHub repository:

**Step 1: Create a `/public` folder in your repository root**

**Step 2: Add these two image files:**
- `/public/favicon.png` - The "S" logo favicon (48x48px or larger)
- `/public/og-image.png` - The social sharing banner (1200x630px recommended)

**How to add them:**

1. **Via GitHub Web Interface:**
   - Go to your repository on GitHub
   - Click "Add file" → "Create new file"
   - Type `public/favicon.png` in the filename field (this creates the folder)
   - Click "Choose your files" and upload the favicon image
   - Commit the file
   - Repeat for `public/og-image.png`

2. **Via Git locally:**
   ```bash
   # Clone your repo
   git clone <your-repo-url>
   cd <your-repo>
   
   # Create public folder
   mkdir public
   
   # Copy your images
   cp /path/to/favicon.png public/favicon.png
   cp /path/to/og-image.png public/og-image.png
   
   # Commit and push
   git add public/
   git commit -m "Add favicon and OG image"
   git push
   ```

3. **Image Specifications:**
   - **favicon.png**: Square image, preferably 512x512px (will be scaled down)
   - **og-image.png**: 1200x630px (standard social media preview size)

**Why manual upload?**
Vite's `/public` folder gets copied directly to the build output. Files here need to be actual image files in your Git repository, not virtual imports from Figma Make.

Once added, these will be available at:
- `https://creatorpricing.com/favicon.png`
- `https://creatorpricing.com/og-image.png`

And the meta tags in `index.html` will automatically display them for favicons and social sharing!

## License

Private - All rights reserved