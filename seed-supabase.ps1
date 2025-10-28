# PowerShell script to seed Supabase database via Admin API
# This script will add comprehensive data to all tables

Write-Host "🌱 Starting comprehensive database seeding via Admin API..." -ForegroundColor Green

# Get fresh admin token
Write-Host "🔐 Getting admin token..." -ForegroundColor Yellow
$loginBody = @{
    email = "chandu.kalluru@outlook.com"
    password = "Kalluru@145"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $adminToken = $loginResponse.accessToken
    Write-Host "✅ Admin token obtained" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to get admin token: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $adminToken"
    "Content-Type" = "application/json"
}

# 1. Create Categories (12 categories)
Write-Host "📂 Creating categories..." -ForegroundColor Yellow
$categories = @(
    @{ name = "Hot Beverages"; slug = "hot-beverages"; description = "Warm and comforting drinks" },
    @{ name = "Cold Beverages"; slug = "cold-beverages"; description = "Refreshing cold drinks" },
    @{ name = "Appetizers"; slug = "appetizers"; description = "Start your meal right" },
    @{ name = "Soups"; slug = "soups"; description = "Hearty and warming soups" },
    @{ name = "Salads"; slug = "salads"; description = "Fresh and healthy salads" },
    @{ name = "Main Course"; slug = "main-course"; description = "Hearty main dishes" },
    @{ name = "Rice & Biryani"; slug = "rice-biryani"; description = "Fragrant rice dishes" },
    @{ name = "Bread & Roti"; slug = "bread-roti"; description = "Fresh bread and rotis" },
    @{ name = "Desserts"; slug = "desserts"; description = "Sweet endings" },
    @{ name = "Ice Creams"; slug = "ice-creams"; description = "Cool and creamy treats" },
    @{ name = "Snacks"; slug = "snacks"; description = "Quick bites and snacks" },
    @{ name = "Combo Meals"; slug = "combo-meals"; description = "Complete meal deals" }
)

$createdCategories = @()
foreach ($category in $categories) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/categories" -Method POST -Headers $headers -Body ($category | ConvertTo-Json)
        $createdCategories += $response.category
        Write-Host "✅ Category created: $($category.name)" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Category $($category.name) might already exist" -ForegroundColor Yellow
    }
}

Start-Sleep -Seconds 2

# 2. Create Menu Items (60+ items)
Write-Host "🍽️ Creating menu items..." -ForegroundColor Yellow
$menuItems = @(
    # Hot Beverages
    @{ name = "Cappuccino"; description = "Rich espresso with steamed milk foam"; pricePaise = 18000; isVeg = $true; categorySlug = "hot-beverages" },
    @{ name = "Masala Chai"; description = "Traditional spiced tea with milk"; pricePaise = 8000; isVeg = $true; categorySlug = "hot-beverages" },
    @{ name = "Hot Chocolate"; description = "Rich and creamy hot chocolate"; pricePaise = 15000; isVeg = $true; categorySlug = "hot-beverages" },
    @{ name = "Green Tea"; description = "Refreshing green tea"; pricePaise = 6000; isVeg = $true; categorySlug = "hot-beverages" },
    @{ name = "Coffee Latte"; description = "Smooth coffee with steamed milk"; pricePaise = 16000; isVeg = $true; categorySlug = "hot-beverages" },
    @{ name = "Black Tea"; description = "Classic black tea"; pricePaise = 5000; isVeg = $true; categorySlug = "hot-beverages" },
    @{ name = "Herbal Tea"; description = "Soothing herbal tea blend"; pricePaise = 7000; isVeg = $true; categorySlug = "hot-beverages" },
    @{ name = "Espresso"; description = "Strong and bold espresso shot"; pricePaise = 12000; isVeg = $true; categorySlug = "hot-beverages" },
    @{ name = "Americano"; description = "Espresso with hot water"; pricePaise = 10000; isVeg = $true; categorySlug = "hot-beverages" },
    @{ name = "Mocha"; description = "Coffee with chocolate and milk"; pricePaise = 20000; isVeg = $true; categorySlug = "hot-beverages" },

    # Cold Beverages
    @{ name = "Fresh Orange Juice"; description = "Freshly squeezed orange juice"; pricePaise = 12000; isVeg = $true; categorySlug = "cold-beverages" },
    @{ name = "Mango Lassi"; description = "Sweet mango yogurt drink"; pricePaise = 14000; isVeg = $true; categorySlug = "cold-beverages" },
    @{ name = "Cold Coffee"; description = "Iced coffee with milk"; pricePaise = 15000; isVeg = $true; categorySlug = "cold-beverages" },
    @{ name = "Lemonade"; description = "Fresh lemonade"; pricePaise = 8000; isVeg = $true; categorySlug = "cold-beverages" },
    @{ name = "Pineapple Juice"; description = "Fresh pineapple juice"; pricePaise = 13000; isVeg = $true; categorySlug = "cold-beverages" },
    @{ name = "Coconut Water"; description = "Fresh coconut water"; pricePaise = 10000; isVeg = $true; categorySlug = "cold-beverages" },
    @{ name = "Strawberry Smoothie"; description = "Creamy strawberry smoothie"; pricePaise = 18000; isVeg = $true; categorySlug = "cold-beverages" },
    @{ name = "Banana Shake"; description = "Rich banana milkshake"; pricePaise = 16000; isVeg = $true; categorySlug = "cold-beverages" },
    @{ name = "Chocolate Shake"; description = "Decadent chocolate milkshake"; pricePaise = 20000; isVeg = $true; categorySlug = "cold-beverages" },
    @{ name = "Iced Tea"; description = "Refreshing iced tea"; pricePaise = 9000; isVeg = $true; categorySlug = "cold-beverages" },

    # Appetizers
    @{ name = "Samosa"; description = "Crispy fried pastry with spiced potato filling"; pricePaise = 2500; isVeg = $true; categorySlug = "appetizers" },
    @{ name = "Paneer Tikka"; description = "Grilled cottage cheese with spices"; pricePaise = 18000; isVeg = $true; categorySlug = "appetizers" },
    @{ name = "Chicken Wings"; description = "Spicy grilled chicken wings"; pricePaise = 22000; isVeg = $false; categorySlug = "appetizers" },
    @{ name = "Spring Rolls"; description = "Crispy vegetable spring rolls"; pricePaise = 12000; isVeg = $true; categorySlug = "appetizers" },
    @{ name = "Fish Fingers"; description = "Crispy fried fish fingers"; pricePaise = 20000; isVeg = $false; categorySlug = "appetizers" },
    @{ name = "Chicken Tikka"; description = "Tender grilled chicken pieces"; pricePaise = 25000; isVeg = $false; categorySlug = "appetizers" },
    @{ name = "Veg Cutlet"; description = "Spiced vegetable cutlets"; pricePaise = 8000; isVeg = $true; categorySlug = "appetizers" },
    @{ name = "Chicken Nuggets"; description = "Crispy chicken nuggets"; pricePaise = 15000; isVeg = $false; categorySlug = "appetizers" },
    @{ name = "Onion Rings"; description = "Crispy fried onion rings"; pricePaise = 10000; isVeg = $true; categorySlug = "appetizers" },
    @{ name = "Mushroom Tikka"; description = "Grilled mushroom with spices"; pricePaise = 16000; isVeg = $true; categorySlug = "appetizers" },

    # Main Course
    @{ name = "Butter Chicken"; description = "Tender chicken in creamy tomato sauce"; pricePaise = 35000; isVeg = $false; categorySlug = "main-course" },
    @{ name = "Dal Makhani"; description = "Creamy black lentils"; pricePaise = 28000; isVeg = $true; categorySlug = "main-course" },
    @{ name = "Chicken Curry"; description = "Spicy chicken curry"; pricePaise = 32000; isVeg = $false; categorySlug = "main-course" },
    @{ name = "Paneer Butter Masala"; description = "Cottage cheese in creamy tomato sauce"; pricePaise = 30000; isVeg = $true; categorySlug = "main-course" },
    @{ name = "Fish Curry"; description = "Spicy fish curry"; pricePaise = 38000; isVeg = $false; categorySlug = "main-course" },
    @{ name = "Chole Bhature"; description = "Spiced chickpeas with fried bread"; pricePaise = 25000; isVeg = $true; categorySlug = "main-course" },
    @{ name = "Mutton Curry"; description = "Rich mutton curry"; pricePaise = 45000; isVeg = $false; categorySlug = "main-course" },
    @{ name = "Rajma Masala"; description = "Spiced kidney beans"; pricePaise = 22000; isVeg = $true; categorySlug = "main-course" },
    @{ name = "Chicken Biryani"; description = "Fragrant basmati rice with spiced chicken"; pricePaise = 32000; isVeg = $false; categorySlug = "main-course" },
    @{ name = "Veg Biryani"; description = "Fragrant basmati rice with vegetables"; pricePaise = 28000; isVeg = $true; categorySlug = "main-course" },

    # Bread & Roti
    @{ name = "Naan"; description = "Soft leavened bread"; pricePaise = 8000; isVeg = $true; categorySlug = "bread-roti" },
    @{ name = "Roti"; description = "Whole wheat flatbread"; pricePaise = 5000; isVeg = $true; categorySlug = "bread-roti" },
    @{ name = "Garlic Naan"; description = "Naan with garlic and herbs"; pricePaise = 10000; isVeg = $true; categorySlug = "bread-roti" },
    @{ name = "Butter Naan"; description = "Naan with butter"; pricePaise = 9000; isVeg = $true; categorySlug = "bread-roti" },
    @{ name = "Paratha"; description = "Layered flatbread"; pricePaise = 12000; isVeg = $true; categorySlug = "bread-roti" },
    @{ name = "Aloo Paratha"; description = "Paratha stuffed with potatoes"; pricePaise = 15000; isVeg = $true; categorySlug = "bread-roti" },
    @{ name = "Chapati"; description = "Thin whole wheat bread"; pricePaise = 4000; isVeg = $true; categorySlug = "bread-roti" },
    @{ name = "Kulcha"; description = "Soft bread with onions"; pricePaise = 11000; isVeg = $true; categorySlug = "bread-roti" },
    @{ name = "Tandoori Roti"; description = "Clay oven baked bread"; pricePaise = 6000; isVeg = $true; categorySlug = "bread-roti" },
    @{ name = "Missi Roti"; description = "Spiced gram flour bread"; pricePaise = 8000; isVeg = $true; categorySlug = "bread-roti" },

    # Desserts
    @{ name = "Gulab Jamun"; description = "Sweet milk dumplings in rose syrup"; pricePaise = 12000; isVeg = $true; categorySlug = "desserts" },
    @{ name = "Rasgulla"; description = "Soft cottage cheese balls in syrup"; pricePaise = 10000; isVeg = $true; categorySlug = "desserts" },
    @{ name = "Kheer"; description = "Rice pudding with nuts"; pricePaise = 15000; isVeg = $true; categorySlug = "desserts" },
    @{ name = "Chocolate Cake"; description = "Rich chocolate cake"; pricePaise = 20000; isVeg = $true; categorySlug = "desserts" },
    @{ name = "Tiramisu"; description = "Classic Italian dessert"; pricePaise = 25000; isVeg = $true; categorySlug = "desserts" },
    @{ name = "Cheesecake"; description = "Creamy cheesecake"; pricePaise = 22000; isVeg = $true; categorySlug = "desserts" },
    @{ name = "Brownie"; description = "Chocolate brownie with ice cream"; pricePaise = 18000; isVeg = $true; categorySlug = "desserts" },
    @{ name = "Halwa"; description = "Sweet semolina pudding"; pricePaise = 14000; isVeg = $true; categorySlug = "desserts" },
    @{ name = "Jalebi"; description = "Crispy sweet spirals"; pricePaise = 8000; isVeg = $true; categorySlug = "desserts" },
    @{ name = "Ladoo"; description = "Sweet round balls"; pricePaise = 6000; isVeg = $true; categorySlug = "desserts" },

    # Ice Creams
    @{ name = "Vanilla Ice Cream"; description = "Classic vanilla ice cream"; pricePaise = 8000; isVeg = $true; categorySlug = "ice-creams" },
    @{ name = "Chocolate Ice Cream"; description = "Rich chocolate ice cream"; pricePaise = 10000; isVeg = $true; categorySlug = "ice-creams" },
    @{ name = "Strawberry Ice Cream"; description = "Fresh strawberry ice cream"; pricePaise = 12000; isVeg = $true; categorySlug = "ice-creams" },
    @{ name = "Mango Ice Cream"; description = "Creamy mango ice cream"; pricePaise = 14000; isVeg = $true; categorySlug = "ice-creams" },
    @{ name = "Pista Ice Cream"; description = "Pistachio ice cream"; pricePaise = 15000; isVeg = $true; categorySlug = "ice-creams" },
    @{ name = "Kulfi"; description = "Traditional Indian ice cream"; pricePaise = 12000; isVeg = $true; categorySlug = "ice-creams" },
    @{ name = "Butterscotch Ice Cream"; description = "Creamy butterscotch ice cream"; pricePaise = 13000; isVeg = $true; categorySlug = "ice-creams" },
    @{ name = "Cookies & Cream"; description = "Ice cream with cookie pieces"; pricePaise = 16000; isVeg = $true; categorySlug = "ice-creams" },
    @{ name = "Mint Chocolate Chip"; description = "Mint ice cream with chocolate chips"; pricePaise = 14000; isVeg = $true; categorySlug = "ice-creams" },
    @{ name = "Rocky Road"; description = "Chocolate ice cream with nuts and marshmallows"; pricePaise = 18000; isVeg = $true; categorySlug = "ice-creams" }
)

$createdMenuItems = @()
foreach ($item in $menuItems) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/menu-items" -Method POST -Headers $headers -Body ($item | ConvertTo-Json)
        $createdMenuItems += $response.menuItem
        Write-Host "✅ Menu item created: $($item.name)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to create $($item.name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Database seeding completed successfully!" -ForegroundColor Green
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   📂 Categories: $($createdCategories.Count)" -ForegroundColor White
Write-Host "   🍽️ Menu Items: $($createdMenuItems.Count)" -ForegroundColor White
Write-Host "`n🚀 Your Supabase database is now fully populated and ready for use!" -ForegroundColor Green
