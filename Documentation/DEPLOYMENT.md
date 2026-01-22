# Deployment Guide

This guide covers deploying your Aries Ventures website to various hosting platforms.

## 🏗️ Build for Production

First, create a production build:

```bash
npm run build
```

This creates optimized files in the `dist/aries-ventures/` directory.

## 🚀 Deployment Options

### Option 1: Netlify (Recommended - Free)

**Why Netlify?**
- Free hosting for static sites
- Automatic HTTPS
- Continuous deployment from Git
- Easy custom domain setup

**Steps:**

1. **Sign up** at [netlify.com](https://netlify.com)

2. **Deploy via Drag & Drop:**
   - Build your project: `npm run build`
   - Drag the `dist/aries-ventures/browser` folder to Netlify

3. **Deploy via Git (Recommended):**
   ```bash
   # Initialize git (if not already)
   git init
   git add .
   git commit -m "Initial commit"
   
   # Push to GitHub
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```
   
   - Connect your GitHub repo in Netlify
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist/aries-ventures/browser`

4. **Custom Domain:**
   - Go to Domain settings
   - Add your custom domain
   - Update DNS records as instructed

### Option 2: Vercel (Free)

**Why Vercel?**
- Optimized for Angular
- Free tier available
- Excellent performance
- Easy Git integration

**Steps:**

1. **Sign up** at [vercel.com](https://vercel.com)

2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project or create new
   - Set build command: `npm run build`
   - Set output directory: `dist/aries-ventures/browser`

4. **Production deployment:**
   ```bash
   vercel --prod
   ```

### Option 3: GitHub Pages (Free)

**Steps:**

1. **Install angular-cli-ghpages:**
   ```bash
   npm install -g angular-cli-ghpages
   ```

2. **Build with base href:**
   ```bash
   ng build --base-href "https://YOUR_USERNAME.github.io/YOUR_REPO/"
   ```

3. **Deploy:**
   ```bash
   npx angular-cli-ghpages --dir=dist/aries-ventures/browser
   ```

### Option 4: Firebase Hosting (Free)

**Steps:**

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login:**
   ```bash
   firebase login
   ```

3. **Initialize:**
   ```bash
   firebase init hosting
   ```
   
   - Select your project
   - Public directory: `dist/aries-ventures/browser`
   - Single-page app: Yes
   - Overwrite index.html: No

4. **Deploy:**
   ```bash
   npm run build
   firebase deploy
   ```

### Option 5: AWS S3 + CloudFront

**For larger scale deployments:**

1. **Build:**
   ```bash
   npm run build
   ```

2. **Create S3 bucket:**
   - Enable static website hosting
   - Upload `dist/aries-ventures/browser` contents

3. **Set up CloudFront:**
   - Create distribution
   - Point to S3 bucket
   - Configure SSL certificate

4. **Deploy updates:**
   ```bash
   aws s3 sync dist/aries-ventures/browser s3://your-bucket-name
   aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
   ```

## 🔧 Pre-Deployment Checklist

- [ ] Run production build successfully
- [ ] Test production build locally
- [ ] Update environment variables
- [ ] Configure custom domain (if applicable)
- [ ] Set up SSL certificate
- [ ] Test all pages and links
- [ ] Verify form submissions work
- [ ] Check mobile responsiveness
- [ ] Test on different browsers
- [ ] Set up analytics
- [ ] Configure error pages (404, etc.)

## 🌐 Custom Domain Setup

### For Netlify/Vercel:

1. **Add domain in platform dashboard**
2. **Update DNS records:**
   ```
   Type: A
   Name: @
   Value: [Platform IP]
   
   Type: CNAME
   Name: www
   Value: [Platform domain]
   ```

### SSL Certificate:

Most platforms (Netlify, Vercel, Firebase) provide free SSL automatically via Let's Encrypt.

## 📊 Post-Deployment

### 1. Set up Analytics

**Google Analytics:**
```html
<!-- Add to src/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Set up Form Backend

**Options:**
- **Netlify Forms** (if using Netlify)
- **Formspree** - [formspree.io](https://formspree.io)
- **EmailJS** - [emailjs.com](https://emailjs.com)
- **Custom API** - Build your own backend

**Example with Formspree:**
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <!-- Your form fields -->
</form>
```

### 3. Monitor Performance

**Tools:**
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Lighthouse (Chrome DevTools)

### 4. Set up Error Monitoring

**Options:**
- Sentry
- Rollbar
- LogRocket

## 🔄 Continuous Deployment

### GitHub Actions Example:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      with:
        args: deploy --prod --dir=dist/aries-ventures/browser
```

## 🐛 Troubleshooting

### Build fails:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 errors on refresh:
- Configure server to redirect all routes to index.html
- Most platforms handle this automatically for SPAs

### Images not loading:
- Check image paths are relative
- Verify images are in `src/assets/`
- Check build output includes assets

### Styles not applying:
- Verify Tailwind CSS is configured
- Check `styles.css` is imported
- Clear browser cache

## 📱 Testing Deployed Site

1. **Functionality:**
   - [ ] All navigation links work
   - [ ] Smooth scrolling works
   - [ ] Dark mode toggle works
   - [ ] Form submission works
   - [ ] All buttons are clickable

2. **Performance:**
   - [ ] Page loads in < 3 seconds
   - [ ] Images are optimized
   - [ ] No console errors
   - [ ] Lighthouse score > 90

3. **Responsiveness:**
   - [ ] Mobile view works
   - [ ] Tablet view works
   - [ ] Desktop view works
   - [ ] All breakpoints tested

4. **SEO:**
   - [ ] Meta tags present
   - [ ] Title tag correct
   - [ ] Description tag present
   - [ ] Open Graph tags (optional)

## 🎉 You're Live!

Once deployed, share your site:
- Update business cards
- Share on social media
- Submit to search engines
- Add to portfolio

---

**Need help?** Check the platform-specific documentation or reach out to their support teams.
