# Creator Pricing Calculator

A free pricing calculator for creators and creative freelancers that converts your monthly or annual expenses into a baseline rate.

## Features

- Calculate floor pricing based on expenses and business costs
- Apply tax rate, emergency buffer, and reinvestment percentages
- View pricing across multiple service types (hourly, project-based, day rates, retainers)
- Export results as PNG, PDF, or JSON
- Import previous calculations from JSON
- Mobile-optimized with liquid glass aesthetic

## SEO & Discoverability

The app includes comprehensive SEO optimizations:
- **Meta tags**: Title, description, keywords, author, robots
- **Open Graph tags**: For Facebook, LinkedIn sharing
- **Twitter Card tags**: For optimal Twitter/X previews
- **Structured data**: JSON-LD schema for search engines
- **Sitemap**: `/sitemap.xml` for search engine crawlers
- **Robots.txt**: Allows all search engines to index the site
- **Semantic HTML**: Proper use of header, main, nav, footer tags
- **Canonical URL**: Prevents duplicate content issues

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- Radix UI components
- Motion (Framer Motion)
- html2canvas & jsPDF for exports

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

This app is configured for Netlify deployment.

### IMPORTANT: Before First Deploy

**You need to manually add the favicon and OG image to GitHub AFTER deploying from Figma Make:**

1. **Deploy from Figma Make first** (this creates placeholder files)
2. **Go to your GitHub repo** → Navigate to the `/public` folder
3. **Replace these two files:**
   - `favicon.png` - Download from: https://github.com/user-attachments/assets/efeaa686-8807-48c4-a683-24c80ccf15fc
   - `og-image.png` - Download from: https://github.com/user-attachments/assets/59ec8fc5-0c9c-4b4e-9b65-28542399c7f9
4. **Upload them to GitHub** (delete the placeholder text files, upload the actual PNG images)
5. **Netlify will auto-redeploy** and the images will work!

**Why manual?** Figma Make can't create binary image files, only text files. The placeholders ensure the folder structure exists, then you replace them with real images in GitHub.

1. Push changes to your GitHub repository
2. Netlify will automatically build and deploy
3. Build command: `npm run build`
4. Publish directory: `dist`

## License

Private - All rights reserved