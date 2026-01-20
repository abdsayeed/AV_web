#!/bin/bash

echo "🚀 Starting Aries Ventures Website Setup..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Add your logo to: src/assets/logo.png"
    echo "   2. Run 'npm start' to start the development server"
    echo "   3. Open http://localhost:4200 in your browser"
    echo ""
    echo "🎨 To customize content, edit: src/app/app.component.ts"
    echo "📖 For more info, check: README.md and SETUP.md"
    echo ""
else
    echo ""
    echo "❌ Installation failed. Please check the error messages above."
    exit 1
fi
