# Favicon Setup Instructions

## Quick Setup (Minimum Required)

To get your Aries Ventures logo working as a favicon, you need these files:

### Essential Files (Minimum):
1. `favicon.ico` - 32x32 ICO format (main favicon)
2. `favicon-192x192.png` - 192x192 PNG (Android/Chrome)
3. `apple-touch-icon.png` - 180x180 PNG (iOS/Safari)

### How to Create These:

#### Option 1: Online Generator (Recommended)
1. Go to https://realfavicongenerator.net/
2. Upload your Aries Ventures logo
3. Download the generated package
4. Copy all files to this folder (`frontend/src/assets/`)

#### Option 2: Manual Creation
1. Resize your logo to these sizes:
   - 32x32 pixels → save as `favicon.ico`
   - 192x192 pixels → save as `favicon-192x192.png`
   - 180x180 pixels → save as `apple-touch-icon.png`

### Current Status:
- ✅ HTML updated with favicon links
- ✅ Web manifest created
- ✅ Browser config created
- ❌ Favicon image files needed

### After Adding Files:
1. Restart your development server
2. Clear browser cache (Ctrl+F5)
3. Check the browser tab for your logo

### Testing:
- Chrome: Should show in tab and bookmarks
- Safari: Should show in tab and when saved to home screen
- Firefox: Should show in tab and bookmarks
- Edge: Should show in tab and start menu tiles