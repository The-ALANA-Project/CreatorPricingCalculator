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

### Favicon and OG Image

The favicon and social sharing images are **automatically downloaded during the build process** from GitHub Assets URLs. A custom Vite plugin fetches the images and saves them to the `/public` folder, which is then copied to the build output.

**How it works:**
- During `npm run build`, the Vite plugin downloads the images from GitHub
- Files are saved to `/public/favicon.png` and `/public/og-image.png`
- Vite copies the `/public` folder to the `dist` output
- Images are served from your domain: `creatorpricing.com/favicon.png` and `creatorpricing.com/og-image.png`

No manual uploads needed! 🎉

## License

Private - All rights reserved