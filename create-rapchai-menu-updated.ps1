# Create Complete Rapchai Menu in Updated Supabase Database
Write-Host "🍽️ Creating complete Rapchai menu in updated Supabase database..." -ForegroundColor Green

# Get fresh admin token
$loginBody = '{"email":"chandu.kalluru@outlook.com","password":"Kalluru@145"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$adminToken = $loginResponse.accessToken
$headers = @{"Authorization"="Bearer $adminToken"; "Content-Type"="application/json"}

# 1. Create Rapchai Categories
Write-Host "`n📂 Creating Rapchai categories..." -ForegroundColor Yellow
$categories = @(
    @{ name = "Chais & Signature Coffees"; slug = "chais-coffees"; description = "Traditional Assam chai and signature coffees brewed with our special filter" },
    @{ name = "Mini Burgers"; slug = "mini-burgers"; description = "Perfect bite-sized sliders in veg and non-veg options" },
    @{ name = "Sandwiches"; slug = "sandwiches"; description = "Delicious sandwiches on our 4-inch sub bread" },
    @{ name = "Rolls & Soups"; slug = "rolls-soups"; description = "Juicy rolls and perfect soups for cold days" },
    @{ name = "Our Specials"; slug = "our-specials"; description = "Chef special creations that have become staples" },
    @{ name = "Our Squares"; slug = "our-squares"; description = "Homemade biscuits - spicy, buttery, and fruity" }
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

# 2. Create Menu Items
Write-Host "`n🍽️ Creating Rapchai menu items..." -ForegroundColor Yellow

# Chais & Signature Coffees
$chaiItems = @(
'{"name":"Traditional Assam Chai","description":"Brewed from Assam leaves using our traditional filter for perfect decoction","pricePaise":8000,"isVeg":true,"categorySlug":"chais-coffees"}',
'{"name":"Masala Chai","description":"Spiced chai with aromatic spices","pricePaise":9000,"isVeg":true,"categorySlug":"chais-coffees"}',
'{"name":"Ginger Chai","description":"Warming ginger chai for cold days","pricePaise":9000,"isVeg":true,"categorySlug":"chais-coffees"}',
'{"name":"Cardamom Chai","description":"Fragrant cardamom-infused chai","pricePaise":10000,"isVeg":true,"categorySlug":"chais-coffees"}',
'{"name":"Cold Chai","description":"Refreshing iced chai perfect for warm days","pricePaise":10000,"isVeg":true,"categorySlug":"chais-coffees"}',
'{"name":"Signature Coffee","description":"Our special coffee blend brewed with traditional filter","pricePaise":12000,"isVeg":true,"categorySlug":"chais-coffees"}',
'{"name":"Cappuccino","description":"Rich espresso with steamed milk foam","pricePaise":15000,"isVeg":true,"categorySlug":"chais-coffees"}',
'{"name":"Latte","description":"Smooth coffee with steamed milk","pricePaise":14000,"isVeg":true,"categorySlug":"chais-coffees"}',
'{"name":"Americano","description":"Strong black coffee","pricePaise":10000,"isVeg":true,"categorySlug":"chais-coffees"}',
'{"name":"Cold Coffee","description":"Iced coffee with milk","pricePaise":13000,"isVeg":true,"categorySlug":"chais-coffees"}'
)

# Mini Burgers
$burgerItems = @(
'{"name":"Veg Mini Burger","description":"Perfect bite-sized veg slider with fresh vegetables","pricePaise":12000,"isVeg":true,"categorySlug":"mini-burgers"}',
'{"name":"Chicken Mini Burger","description":"Juicy chicken patty in a mini bun","pricePaise":15000,"isVeg":false,"categorySlug":"mini-burgers"}',
'{"name":"Beef Mini Burger","description":"Tender beef patty slider","pricePaise":18000,"isVeg":false,"categorySlug":"mini-burgers"}',
'{"name":"Paneer Mini Burger","description":"Cottage cheese patty with spices","pricePaise":14000,"isVeg":true,"categorySlug":"mini-burgers"}',
'{"name":"Fish Mini Burger","description":"Crispy fish patty slider","pricePaise":16000,"isVeg":false,"categorySlug":"mini-burgers"}',
'{"name":"Mushroom Mini Burger","description":"Grilled mushroom patty slider","pricePaise":13000,"isVeg":true,"categorySlug":"mini-burgers"}'
)

# Sandwiches
$sandwichItems = @(
'{"name":"Veg Sandwich","description":"Fresh vegetables on our 4-inch sub bread","pricePaise":10000,"isVeg":true,"categorySlug":"sandwiches"}',
'{"name":"Chicken Sandwich","description":"Grilled chicken on 4-inch sub bread","pricePaise":14000,"isVeg":false,"categorySlug":"sandwiches"}',
'{"name":"Beef Sandwich","description":"Tender beef on 4-inch sub bread","pricePaise":16000,"isVeg":false,"categorySlug":"sandwiches"}',
'{"name":"Paneer Sandwich","description":"Cottage cheese with vegetables","pricePaise":12000,"isVeg":true,"categorySlug":"sandwiches"}',
'{"name":"Egg Sandwich","description":"Scrambled eggs with vegetables","pricePaise":11000,"isVeg":false,"categorySlug":"sandwiches"}',
'{"name":"Grilled Cheese Sandwich","description":"Melted cheese on toasted bread","pricePaise":10000,"isVeg":true,"categorySlug":"sandwiches"}'
)

# Rolls & Soups
$rollSoupItems = @(
'{"name":"Chicken Roll","description":"Juicy chicken wrapped in soft bread","pricePaise":12000,"isVeg":false,"categorySlug":"rolls-soups"}',
'{"name":"Egg Roll","description":"Scrambled eggs wrapped in soft bread","pricePaise":10000,"isVeg":false,"categorySlug":"rolls-soups"}',
'{"name":"Veg Roll","description":"Fresh vegetables wrapped in soft bread","pricePaise":9000,"isVeg":true,"categorySlug":"rolls-soups"}',
'{"name":"Paneer Roll","description":"Cottage cheese wrapped in soft bread","pricePaise":11000,"isVeg":true,"categorySlug":"rolls-soups"}',
'{"name":"Tomato Soup","description":"Perfect soup for cold days","pricePaise":8000,"isVeg":true,"categorySlug":"rolls-soups"}',
'{"name":"Chicken Soup","description":"Hearty chicken soup","pricePaise":10000,"isVeg":false,"categorySlug":"rolls-soups"}',
'{"name":"Vegetable Soup","description":"Fresh vegetable soup","pricePaise":8000,"isVeg":true,"categorySlug":"rolls-soups"}',
'{"name":"Corn Soup","description":"Sweet corn soup","pricePaise":9000,"isVeg":true,"categorySlug":"rolls-soups"}'
)

# Our Specials
$specialItems = @(
'{"name":"Chef Special Pasta","description":"Our signature pasta creation","pricePaise":18000,"isVeg":true,"categorySlug":"our-specials"}',
'{"name":"Special Chicken Curry","description":"Chef special chicken curry","pricePaise":20000,"isVeg":false,"categorySlug":"our-specials"}',
'{"name":"Rapchai Special Rice","description":"Our unique rice preparation","pricePaise":16000,"isVeg":true,"categorySlug":"our-specials"}',
'{"name":"Special Veggie Bowl","description":"Healthy vegetable bowl","pricePaise":15000,"isVeg":true,"categorySlug":"our-specials"}',
'{"name":"Chef Special Wrap","description":"Our signature wrap creation","pricePaise":14000,"isVeg":true,"categorySlug":"our-specials"}',
'{"name":"Special Fish Fry","description":"Chef special fish preparation","pricePaise":22000,"isVeg":false,"categorySlug":"our-specials"}'
)

# Our Squares
$squareItems = @(
'{"name":"Spicy Squares","description":"Homemade spicy biscuits","pricePaise":3000,"isVeg":true,"categorySlug":"our-squares"}',
'{"name":"Buttery Squares","description":"Rich buttery homemade biscuits","pricePaise":3000,"isVeg":true,"categorySlug":"our-squares"}',
'{"name":"Fruity Squares","description":"Sweet fruity homemade biscuits","pricePaise":3000,"isVeg":true,"categorySlug":"our-squares"}',
'{"name":"Chocolate Squares","description":"Chocolate-flavored homemade biscuits","pricePaise":3500,"isVeg":true,"categorySlug":"our-squares"}',
'{"name":"Mixed Squares","description":"Assorted homemade biscuits","pricePaise":4000,"isVeg":true,"categorySlug":"our-squares"}'
)

$allItems = $chaiItems + $burgerItems + $sandwichItems + $rollSoupItems + $specialItems + $squareItems
$successCount = 0

foreach ($item in $allItems) {
    try {
        Invoke-RestMethod -Uri "http://localhost:3001/api/admin/menu-items" -Method POST -Headers $headers -Body $item | Out-Null
        $successCount++
        Write-Host "✅ Item $successCount created" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to create item" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Rapchai menu creation completed!" -ForegroundColor Green
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   📂 Categories: $($createdCategories.Count)" -ForegroundColor White
Write-Host "   🍽️ Menu Items: $successCount" -ForegroundColor White
Write-Host "`n🚀 Your affordable vibrant cafe menu is now ready in Supabase!" -ForegroundColor Green
Write-Host "✨ Perfect for rap music events and healthy continental dining!" -ForegroundColor Green
