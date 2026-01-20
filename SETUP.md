# Quick Setup Guide

## Step 1: Add Your Logo

1. Copy your Aries Ventures logo to: `src/assets/logo.png`
2. Make sure it's a PNG file with transparent background
3. Recommended dimensions: 200x200px or similar

## Step 2: Install Dependencies

```bash
npm install
```

This will install:
- Angular 17
- Tailwind CSS
- All required dependencies

## Step 3: Run the Development Server

```bash
npm start
```

The app will open at `http://localhost:4200/`

## Step 4: Customize Content

Edit `src/app/app.component.ts` to update:

### Pricing Plans
```typescript
pricingPlans = [
  {
    name: 'Your Plan Name',
    price: '£999',
    // ... more fields
  }
]
```

### Team Members
```typescript
teamMembers = [
  {
    name: 'Your Name',
    role: 'Your Role',
    // ... more fields
  }
]
```

### Contact Information
Update the footer section in `src/app/app.component.html`:
- Email address
- Phone number
- Location

## Step 5: Build for Production

```bash
npm run build
```

Output will be in `dist/aries-ventures/`

## Features Included

✅ Responsive navigation with mobile menu
✅ Dark mode toggle
✅ Smooth scroll between sections
✅ Contact form with validation
✅ 7 complete sections
✅ Professional animations
✅ SEO-friendly structure

## Troubleshooting

### Logo not showing?
- Check the file path: `src/assets/logo.png`
- Verify the file format is PNG
- Clear browser cache and reload

### Styles not loading?
- Run `npm install` again
- Check if Tailwind CSS is properly configured
- Restart the dev server

### Build errors?
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version (should be v18+)

## Next Steps

1. Replace placeholder images with your own
2. Update text content to match your brand
3. Customize colors in `tailwind.config.js`
4. Add your own team photos
5. Configure contact form backend
6. Set up hosting (Netlify, Vercel, etc.)

## Need Help?

Check the main README.md for detailed documentation.
