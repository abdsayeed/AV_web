# Template Customization Guide

## 🎨 How to Add/Edit Templates

Templates are stored in `src/app/app.component.ts` in the `templates` array.

### Template Structure

```typescript
{
  name: 'Template Name',           // Display name
  industry: 'Industry Type',       // Category
  url: 'example.com',             // Demo URL (for display)
  image: 'https://...',           // Screenshot URL
  features: [                     // Feature list
    'Feature 1',
    'Feature 2',
    'Feature 3'
  ],
  badge: 'Popular'                // Optional badge
}
```

## ➕ Adding a New Template

### Step 1: Open the Component File
```bash
# Open in your editor
src/app/app.component.ts
```

### Step 2: Find the Templates Array
Look for line ~60 where `templates = [...]` is defined.

### Step 3: Add Your Template
```typescript
templates = [
  // Existing templates...
  
  // Add your new template here:
  {
    name: 'Your Template Name',
    industry: 'Your Industry',
    url: 'yoursite.com',
    image: 'https://your-image-url.com/screenshot.jpg',
    features: [
      'Feature 1 description',
      'Feature 2 description',
      'Feature 3 description',
      'Feature 4 description',
      'Feature 5 description'
    ],
    badge: 'New'  // Optional: 'Popular', 'New', 'High Conversion', etc.
  }
];
```

## ✏️ Editing Existing Templates

### Change Template Name:
```typescript
name: 'New Name Here',
```

### Change Industry:
```typescript
industry: 'New Industry Type',
```

### Update Screenshot:
```typescript
image: 'https://new-image-url.com/screenshot.jpg',
```

### Modify Features:
```typescript
features: [
  'Updated feature 1',
  'Updated feature 2',
  'New feature 3',
  'New feature 4',
  'New feature 5'
],
```

### Add/Remove Badge:
```typescript
badge: 'Featured'  // Or remove this line entirely
```

## 🖼️ Getting Template Screenshots

### Option 1: Use Existing Images
- Keep the current Google-hosted images
- They're already optimized and fast

### Option 2: Add Your Own Screenshots
1. Take a screenshot of your template
2. Optimize the image (recommended: 1200x800px)
3. Upload to your hosting or use a service like:
   - Imgur
   - Cloudinary
   - Your own server
4. Copy the direct image URL
5. Paste into the `image` field

### Option 3: Use Placeholder Services
```typescript
image: 'https://via.placeholder.com/1200x800/0369a1/ffffff?text=Your+Template',
```

## 🏷️ Badge Options

Common badge types:
- `'Popular'` - Most used
- `'New'` - Recently added
- `'High Conversion'` - Best performing
- `'Featured'` - Highlighted
- `'Premium'` - High-end option
- `''` - No badge (empty string)

## 📋 Complete Example

Here's a complete template example:

```typescript
{
  name: 'The Digital Boutique',
  industry: 'Fashion & Retail',
  url: 'digitalboutique.com',
  image: 'https://example.com/boutique-screenshot.jpg',
  features: [
    'E-commerce Integration',
    'Product Gallery with Zoom',
    'Shopping Cart & Checkout',
    'Inventory Management',
    'Customer Reviews System'
  ],
  badge: 'Popular'
}
```

## 🔄 Quick Template Swap

To quickly replace all templates:

1. Open `src/app/app.component.ts`
2. Find the `templates` array (around line 60)
3. Replace the entire array:

```typescript
templates = [
  {
    name: 'Template 1',
    industry: 'Industry 1',
    url: 'site1.com',
    image: 'https://...',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    badge: 'Popular'
  },
  {
    name: 'Template 2',
    industry: 'Industry 2',
    url: 'site2.com',
    image: 'https://...',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    badge: 'New'
  },
  {
    name: 'Template 3',
    industry: 'Industry 3',
    url: 'site3.com',
    image: 'https://...',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    badge: ''
  }
];
```

4. Save the file
5. The website will automatically reload

## 🎯 Industry Categories

Suggested industry categories:
- Barbershops & Salons
- Cafes & Restaurants
- Home Services (Plumbing, HVAC, etc.)
- Landscaping & Gardening
- Boutique Retail
- Professional Services (Law, Accounting, etc.)
- Fitness & Wellness
- Real Estate
- Photography
- Automotive
- Healthcare
- Education
- Technology
- Construction
- Event Planning

## 💡 Pro Tips

### 1. Keep Feature Lists Consistent
Try to have 3-5 features per template for visual consistency.

### 2. Use High-Quality Images
- Minimum 1200px wide
- Clear, professional screenshots
- Show the actual template design

### 3. Descriptive Feature Names
```typescript
// ❌ Bad
features: ['Good design', 'Fast', 'Nice']

// ✅ Good
features: [
  'Responsive Mobile Design',
  'Lightning-Fast Load Times',
  'Modern UI/UX Interface'
]
```

### 4. Badge Usage
Don't overuse badges. Only 1-2 templates should have badges to maintain their impact.

### 5. Industry Matching
Make sure the template name and features match the industry type.

## 🔍 Testing Your Changes

After adding/editing templates:

1. Save the file
2. Check the browser (should auto-reload)
3. Scroll to Templates section
4. Click "Preview Template" to test the modal
5. Verify all features display correctly
6. Test "Use This Template" button

## 📱 Mobile Preview

Always test your templates on mobile:
1. Open browser DevTools (F12)
2. Toggle device toolbar
3. Select a mobile device
4. Check template cards and modal

## 🚀 Quick Actions

### Add 1 Template:
```bash
# Time: 2 minutes
1. Open src/app/app.component.ts
2. Copy an existing template
3. Modify the values
4. Save
```

### Replace All Templates:
```bash
# Time: 5 minutes
1. Open src/app/app.component.ts
2. Find templates array
3. Replace entire array
4. Save
```

### Update Template Images:
```bash
# Time: 1 minute per template
1. Find the template in the array
2. Update the image URL
3. Save
```

## 🆘 Troubleshooting

### Template Not Showing?
- Check for syntax errors (missing commas, brackets)
- Verify the template is inside the `templates` array
- Check browser console for errors (F12)

### Image Not Loading?
- Verify the URL is correct
- Check if the image URL is publicly accessible
- Try opening the URL directly in browser

### Modal Not Opening?
- Check browser console for errors
- Verify the `viewTemplate()` method is called
- Check if `showTemplateModal` is being set

### Features Not Displaying?
- Verify features is an array: `features: [...]`
- Check for proper string quotes
- Ensure commas between items

## 📚 Related Files

- **Templates Data**: `src/app/app.component.ts` (line ~60)
- **Template Display**: `src/app/app.component.html` (Templates section)
- **Template Modal**: `src/app/app.component.html` (Modal section)
- **Styling**: `src/app/app.component.css`

---

**Need help? Check the main README.md or QUICK_REFERENCE.md**
