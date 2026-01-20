# Aries Ventures - Professional Web Services

A modern, responsive single-page Angular application with smooth scrolling sections, built with Tailwind CSS.

## Features

- ✨ Single-page application with smooth scroll navigation
- 🎨 Modern, professional design with dark mode support
- 📱 Fully responsive (mobile, tablet, desktop)
- 🚀 Fast and optimized
- 🎯 7 main sections: Home, How It Works, Services, Clients, Templates, Team, Contact
- 🌙 Dark/Light mode toggle
- 📋 Contact form with validation

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Add your logo:
   - Place your logo file at `src/assets/logo.png`
   - The logo should be a PNG file with transparent background
   - Recommended size: 200x200px or similar aspect ratio

## Development

Run the development server:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
aries-ventures/
├── src/
│   ├── app/
│   │   ├── app.component.ts       # Main component logic
│   │   ├── app.component.html     # Main template
│   │   └── app.component.css      # Component styles
│   ├── assets/
│   │   └── logo.png              # Your logo (add this)
│   ├── index.html                # Main HTML file
│   ├── main.ts                   # Application entry point
│   └── styles.css                # Global styles
├── angular.json                  # Angular configuration
├── package.json                  # Dependencies
├── tailwind.config.js           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

## Sections

### 1. Home (Hero)
- Eye-catching hero section with CTA buttons
- Trust indicators
- Animated badge

### 2. How It Works
- 4-step process timeline
- Visual step indicators
- Clear descriptions

### 3. Services/Pricing
- 3 pricing tiers with cards
- Feature comparisons
- CTA for consultation

### 4. Ideal Clients
- Industry grid (6 industries)
- Comparison table
- Social proof

### 5. Templates
- 3 template showcases
- Browser mockup frames
- Feature lists

### 6. Team
- 3 team member cards
- Professional photos
- Contact buttons

### 7. Contact
- Comprehensive contact form
- Budget selector
- Service checkboxes
- Form validation

## Customization

### Colors
Edit `tailwind.config.js` to change the color scheme:

```javascript
colors: {
  primary: {
    DEFAULT: '#0369a1', // Change this
    // ... other shades
  },
}
```

### Content
Edit `src/app/app.component.ts` to update:
- Pricing plans
- Team members
- Templates
- Industries
- Navigation items

### Styling
- Global styles: `src/styles.css`
- Component styles: `src/app/app.component.css`
- Tailwind utilities: Use in HTML templates

## Navigation

The top navigation bar:
- Fixed position (always visible)
- Active section highlighting
- Mobile-responsive hamburger menu
- Dark mode toggle
- Smooth scroll to sections

## Dark Mode

Toggle dark mode using the button in the navigation bar. The theme preference is applied via the `dark` class on the `<html>` element.

## Mobile Optimization

- Responsive grid layouts
- Mobile-friendly navigation menu
- Touch-optimized buttons
- Optimized images and assets

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Lazy loading images
- Optimized bundle size
- Smooth scroll performance
- Fast initial load

## License

© 2024 Aries Ventures. All rights reserved.

## Support

For support, email info@ariesventures.com
