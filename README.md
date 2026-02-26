# Creator Pricing Calculator

![Creator Pricing Calculator – Social Preview](https://github.com/user-attachments/assets/59ec8fc5-0c9c-4b4e-9b65-28542399c7f9)

A comprehensive free pricing calculator for creators and creative freelancers that helps you calculate sustainable rates based on your expenses, work capacity, and business goals. Whether you sell physical products or digital services, this tool guides you through a 4-step journey to find your floor price and recommended rates.

## Features

### Core Calculator
- **4-Step Guided Journey**: Creator type selection → Expense input → Income calculation → Service pricing
- **Dual Creator Types**: 
  - Physical Creators (products, workshops, courses)
  - Digital/Content Creators (social media, content creation, digital services)
- **Smart Expense Tracking**: Monthly or annual expense input with automatic conversion
- **Income Calculations**: 
  - Automatic tax calculation (30% default, customizable)
  - Emergency buffer (20% default, customizable)  
  - Reinvestment fund for business growth
  - Total annual income needed
- **Work Capacity Planning**: Define billable hours based on your schedule
- **Volume Discounts**: Automatic bulk pricing for products (10+ units, 50+ units, 100+ units)
- **Custom Services**: Add unlimited custom service types beyond the defaults

### Export & Import
- **PNG Export**: Download your pricing as a high-quality image
- **PDF Templates**: Tailored templates for Physical Creators and Digital/Content Creators
- **JSON Export/Import**: Save and restore your calculations

### Resources Page
- Curated tools, platforms, and help resources for creators
- Community-contributed resources to support your creative business

### Design
- Liquid glass aesthetic with floating elements and glassmorphism
- Brand colors: #FEE6EA (light rose) and #131718 (off-black)
- Work Sans typography
- Fully mobile-optimized and responsive
- Consistent 8px rounded corners and hover effects

## SEO & Discoverability

The app includes comprehensive SEO optimizations:
- **Meta tags**: Title, description, keywords, author, robots
- **Open Graph tags**: For Facebook, LinkedIn, Discord, Telegram, WhatsApp sharing
- **Twitter Card tags**: For optimal Twitter/X previews
- **Structured data**: JSON-LD schema for search engines
- **Sitemap**: `/sitemap.xml` for search engine crawlers (includes /resources page)
- **Robots.txt**: Allows all search engines to index the site
- **Semantic HTML**: Proper use of header, main, nav, footer tags
- **Canonical URL**: Prevents duplicate content issues
- **Google Analytics**: Integrated tracking (G-NG0FTCX2X4)

## Tech Stack

- React 18 with TypeScript
- Vite build tool
- Tailwind CSS v4
- React Router for navigation
- Radix UI components (Button, Card, Input, Label, Tooltip)
- Motion (modern Framer Motion) for animations
- html2canvas & jsPDF for exports
- Lucide React for icons

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

### Netlify Configuration

1. Push changes to your GitHub repository
2. Netlify will automatically build and deploy
3. Build command: `npm run build`
4. Publish directory: `dist`

## Project Structure

```
/src
  /app
    /components
      /ui           # Radix UI component wrappers
      /figma        # Figma-specific components
      CreatorType.tsx
      ExpenseInput.tsx
      IncomeCalculator.tsx
      ServicePricing.tsx
      CookieBanner.tsx
    /pages
      Calculator.tsx
      Resources.tsx
    /routes.ts      # React Router configuration
    App.tsx
  /styles
    theme.css       # Tailwind theme tokens
    fonts.css       # Font imports
  main.tsx
/public
  favicon.png
  og-image.png
  sitemap.xml
  robots.txt
```

## Cookie Compliance

The app uses Google Analytics and includes a cookie consent banner that:
- Appears on first visit
- Persists user choice in localStorage
- Links to Google's privacy policy
- Complies with GDPR/privacy regulations

## License

MIT License

Copyright (c) 2026 Stella Achenbach

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

### What This Means

This project is **open source** under the MIT License, which means:
- ✅ **You can use it freely** - Run, study, modify, and distribute this calculator
- ✅ **You can modify it** - Adapt the code for your own needs or projects
- ✅ **You can use it commercially** - Integrate it into your own products or services
- ✅ **Attribution appreciated** - Keep the copyright notice and give credit to the original author

The only requirement is to include the original copyright and license notice in any copies or substantial portions of the software. No warranty is provided - use at your own risk!

## Contributing

Found a bug or have a suggestion? Feel free to open an issue or submit a pull request.

## Support

If you found this calculator helpful, consider:
- Sharing it with other creators
- [Donating on Ko-fi](https://ko-fi.com/stellaachenbach)
- Contributing resources to the Resources page

---

Made with 💜 by [Stella Achenbach](https://www.linkedin.com/in/stella-achenbach/)