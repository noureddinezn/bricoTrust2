#!/bin/bash
# BricoTrust Quick Setup Script

echo "========================================"
echo "BricoTrust - Quick Setup & Test Guide"
echo "========================================"
echo ""

# Navigate to project
cd "$(dirname "$0")/Src" || exit

echo "📦 Step 1: Installing PHP Dependencies..."
composer install

echo ""
echo "📦 Step 2: Installing JavaScript Dependencies..."
npm install

echo ""
echo "🔑 Step 3: Generating Application Key..."
php artisan key:generate

echo ""
echo "🔗 Step 4: Creating Storage Link..."
php artisan storage:link

echo ""
echo "💾 Step 5: Running Database Migrations..."
echo "Make sure PostgreSQL is running with database 'bricotrust' created!"
echo "Run: CREATE DATABASE bricotrust; in PostgreSQL"
echo ""
read -p "Press Enter when ready to migrate..."
php artisan migrate

echo ""
echo "🌱 Step 6: Seeding Sample Data (Optional)"
read -p "Do you want to seed sample data? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    php artisan db:seed
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "========================================"
echo "Quick Commands:"
echo "========================================"
echo "Start development server:"
echo "  php artisan serve"
echo ""
echo "Watch for file changes:"
echo "  npm run dev"
echo ""
echo "Build for production:"
echo "  npm run build"
echo ""
echo "Run tests:"
echo "  php artisan test"
echo ""
echo "Database reset (careful!):"
echo "  php artisan migrate:refresh --seed"
echo ""
echo "Clear cache:"
echo "  php artisan cache:clear"
echo ""
echo "Visit: http://localhost:8000"
echo "========================================"
