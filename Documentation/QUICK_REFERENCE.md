# Quick Reference Card

## 🚀 Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run automated setup
./start.sh
```

## 📂 Key Files

| File | Purpose |
|------|---------|
| `src/app/app.component.ts` | Main logic & data |
| `src/app/app.component.html` | All page sections |
| `src/app/app.component.css` | Component styles |
| `src/styles.css` | Global styles |
| `tailwind.config.js` | Color & theme config |
| `src/assets/logo.png` | Your logo |

## 🎨 Customization Quick Links

### Update Content
```typescript
// src/app/app.component.ts

// Pricing plans (line ~30)
pricingPlans = [...]

// Team members (line ~80)
teamMembers = [...]

// Templates (line ~60)
templates = [...]

// Industries (line ~50)
industries = [...]
```

### Change Colors
```javascript
// tailwind.config.js

colors: {
  primary: {
    DEFAULT: '#0369a1', // ← Change this
  },
}
```

### Update Navigation
```typescript
// src/app/app.component.ts (line ~20)

navItems = [
  { id: 'home', label: 'Home' },
  // Add/remove items here
]
```

## 🔧 Common Tasks

### Add a New Section
1. Add to `navItems` in `app.component.ts`
2. Add `<section id="new-section">` in `app.component.html`
3. Style as needed

### Change Logo
1. Replace `src/assets/logo.png`
2. Recommended size: 200x200px
3. Format: PNG with transparency

### Update Contact Info
Edit footer in `app.component.html`:
- Email: Line ~520
- Phone: Line ~525
- Location: Line ~530

### Modify Form
Edit contact section in `app.component.html`:
- Form fields: Lines ~450-500
- Form data: `app.component.ts` line ~15

## 📱 Responsive Breakpoints

```css
Mobile:  < 768px
Tablet:  768px - 1024px
Desktop: > 1024px
```

## 🎯 Section IDs

```
#home
#how-it-works
#services
#ideal-clients
#templates
#team
#contact
```

## 🌙 Dark Mode

Toggle via navigation button. Adds `dark` class to `<html>`.

## 📊 Data Structure Examples

### Pricing Plan
```typescript
{
  name: 'Plan Name',
  icon: 'material_icon_name',
  price: '£999',
  priceLabel: 'One-time',
  description: 'Description text',
  color: 'primary', // or 'blue', 'green'
  badge: 'Badge Text',
  image: 'https://...'
}
```

### Team Member
```typescript
{
  name: 'Full Name',
  role: 'Job Title',
  bio: 'Short bio text',
  image: 'https://...'
}
```

### Template
```typescript
{
  name: 'Template Name',
  industry: 'Industry Type',
  url: 'example.com',
  image: 'https://...',
  features: ['Feature 1', 'Feature 2'],
  badge: 'Popular' // optional
}
```

## 🔍 Finding Things

### Where is...?

**Hero section text?**
→ `app.component.html` line ~70

**Pricing cards?**
→ `app.component.html` line ~200

**Team section?**
→ `app.component.html` line ~380

**Contact form?**
→ `app.component.html` line ~450

**Footer?**
→ `app.component.html` line ~520

**Navigation?**
→ `app.component.html` line ~1

## 🎨 Color Classes

```html
<!-- Primary Blue -->
bg-blue-600
text-blue-600
border-blue-600

<!-- Green Accent -->
bg-green-500
text-green-500

<!-- Red Accent -->
bg-red-500
text-red-500

<!-- Dark Mode -->
dark:bg-gray-900
dark:text-white
```

## 📝 Material Icons

Used throughout: `material-symbols-outlined`

Common icons:
- `rocket_launch`
- `calendar_today`
- `terminal`
- `security`
- `check_circle`
- `arrow_forward`
- `menu`
- `close`

[Full icon list](https://fonts.google.com/icons)

## 🐛 Quick Fixes

### Logo not showing?
```bash
# Check file exists
ls src/assets/logo.png

# Use placeholder
# It will auto-fallback to logo-placeholder.svg
```

### Styles not working?
```bash
# Reinstall Tailwind
npm install -D tailwindcss
npm start
```

### Build errors?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Port already in use?
```bash
# Use different port
ng serve --port 4201
```

## 📚 Documentation Files

- `README.md` - Full documentation
- `SETUP.md` - Setup instructions
- `PROJECT_SUMMARY.md` - Project overview
- `VISUAL_GUIDE.md` - Visual structure
- `CUSTOMIZATION_CHECKLIST.md` - Customization tasks
- `DEPLOYMENT.md` - Deployment guide
- `QUICK_REFERENCE.md` - This file

## 🆘 Getting Help

1. Check console for errors (F12)
2. Review documentation files
3. Check Angular docs: [angular.io](https://angular.io)
4. Check Tailwind docs: [tailwindcss.com](https://tailwindcss.com)

## 💡 Pro Tips

- Use `Cmd/Ctrl + F` to search in files
- Test on mobile devices early
- Keep backups before major changes
- Use Git for version control
- Test dark mode regularly
- Optimize images before adding

---

**Print this page for quick reference while coding!**
