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

**BEFORE DEPLOYING**, you need to add the images to the `/public` folder:

**Quick Steps:**

1. **In Figma Make preview**, open this URL in your browser:
   ```
   http://localhost:5173/generate-public-assets.html
   ```

2. **Download both images** by clicking the buttons on that page:
   - Download `favicon.png`
   - Download `og-image.png`

3. **Add them to `/public` folder** in Figma Make:
   - The `/public` folder already exists
   - Use the file upload feature or copy the files there
   
4. **Then deploy!** Everything will work together.

**Alternative - After Deploy:**

If you prefer to deploy first and add images later:

1. **Via GitHub Web Interface:**
   - Go to your repository on GitHub
   - Navigate to the `public` folder
   - Click "Add file" → "Upload files"
   - Upload both `favicon.png` and `og-image.png`
   - Commit the changes
   - Netlify will auto-redeploy

**What These Do:**
- `/public/favicon.png` → Browser tab icon
- `/public/og-image.png` → Social media preview image

The HTML meta tags are already configured to use these files!

## License

Private - All rights reserved