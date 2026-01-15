# Adding Favicon and OG Image - Quick Guide

## 📌 You Need To Do This Manually in GitHub

The favicon and social sharing image need to be added directly to your GitHub repository because they must be real files, not virtual Figma imports.

## 🎯 What You Need

You have two images ready:
1. **Favicon** (the "S" logo) - Save as `favicon.png`
2. **OG Image** (the "CREATOR PRICING CALCULATOR" banner) - Save as `og-image.png`

## 📂 Where To Put Them

Create a `/public` folder in your repository root and add both images there:

```
your-repo/
├── public/
│   ├── favicon.png
│   └── og-image.png
├── src/
├── package.json
└── ...
```

## ✅ Easiest Method: GitHub Web Interface

1. Go to your repository on GitHub
2. Click "Add file" → "Upload files"
3. Drag and drop BOTH images (favicon.png and og-image.png)
4. Make sure they're being uploaded to a folder called `public`
   - If there's no public folder, you can type `public/` before the filename
5. Commit the files

## 🚀 What Happens Next

Once you commit these files:
- Netlify will automatically redeploy
- The files will be copied to your build output
- They'll be accessible at:
  - `https://creatorpricing.com/favicon.png`
  - `https://creatorpricing.com/og-image.png`
- Your meta tags in `index.html` already reference these paths
- Favicon will appear in browser tabs
- OG image will appear when sharing on social media

## ⚠️ Important Notes

- **Don't** try to import these in your React code
- **Don't** use the `figma:asset` import scheme for these
- **Do** use exactly these filenames: `favicon.png` and `og-image.png`
- The `/public` folder in Vite gets copied as-is to the build output

## 🎨 Image Specifications

- **favicon.png**: Square, 512x512px recommended (will scale down automatically)
- **og-image.png**: 1200x630px (standard social media size)

---

That's it! Once these files are in your GitHub repo, everything will work automatically. 🎉
