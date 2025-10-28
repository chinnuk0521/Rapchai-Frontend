# Complete Rapchai Menu Addition to Supabase
Write-Host "🍽️ Adding Complete Rapchai Menu to Supabase Database..." -ForegroundColor Green

# Get fresh admin token
$loginBody = '{"email":"chandu.kalluru@outlook.com","password":"Kalluru@145"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$adminToken = $loginResponse.accessToken
$headers = @{"Authorization"="Bearer $adminToken"; "Content-Type"="application/json"}

Write-Host "✅ Connected to Supabase with fresh token" -ForegroundColor Green

# Define all Rapchai menu items
$rapchaiMenu = @(
    # Chais & Signature Coffees
    @{name="Ginger Chai"; description="Warming ginger chai for cold days"; pricePaise=9000; isVeg=$true; categorySlug="chais-coffees"},
    @{name="Cardamom Chai"; description="Fragrant cardamom-infused chai"; pricePaise=10000; isVeg=$true; categorySlug="chais-coffees"},
    @{name="Cold Chai"; description="Refreshing iced chai perfect for warm days"; pricePaise=10000; isVeg=$true; categorySlug="chais-coffees"},
    @{name="Signature Coffee"; description="Our special coffee blend brewed with traditional filter"; pricePaise=12000; isVeg=$true; categorySlug="chais-coffees"},
    @{name="Cappuccino"; description="Rich espresso with steamed milk foam"; pricePaise=15000; isVeg=$true; categorySlug="chais-coffees"},
    @{name="Latte"; description="Smooth coffee with steamed milk"; pricePaise=14000; isVeg=$true; categorySlug="chais-coffees"},
    @{name="Americano"; description="Strong black coffee"; pricePaise=10000; isVeg=$true; categorySlug="chais-coffees"},
    @{name="Cold Coffee"; description="Iced coffee with milk"; pricePaise=13000; isVeg=$true; categorySlug="chais-coffees"},
    
    # Mini Burgers
    @{name="Beef Mini Burger"; description="Tender beef patty slider"; pricePaise=18000; isVeg=$false; categorySlug="mini-burgers"},
    @{name="Paneer Mini Burger"; description="Cottage cheese patty with spices"; pricePaise=14000; isVeg=$true; categorySlug="mini-burgers"},
    @{name="Fish Mini Burger"; description="Crispy fish patty slider"; pricePaise=16000; isVeg=$false; categorySlug="mini-burgers"},
    @{name="Mushroom Mini Burger"; description="Grilled mushroom patty slider"; pricePaise=13000; isVeg=$true; categorySlug="mini-burgers"},
    
    # Sandwiches
    @{name="Chicken Sandwich"; description="Grilled chicken on 4-inch sub bread"; pricePaise=14000; isVeg=$false; categorySlug="sandwiches"},
    @{name="Beef Sandwich"; description="Tender beef on 4-inch sub bread"; pricePaise=16000; isVeg=$false; categorySlug="sandwiches"},
    @{name="Paneer Sandwich"; description="Cottage cheese with vegetables"; pricePaise=12000; isVeg=$true; categorySlug="sandwiches"},
    @{name="Egg Sandwich"; description="Scrambled eggs with vegetables"; pricePaise=11000; isVeg=$false; categorySlug="sandwiches"},
    @{name="Grilled Cheese Sandwich"; description="Melted cheese on toasted bread"; pricePaise=10000; isVeg=$true; categorySlug="sandwiches"},
    
    # Rolls & Soups
    @{name="Chicken Roll"; description="Juicy chicken wrapped in soft bread"; pricePaise=12000; isVeg=$false; categorySlug="rolls-soups"},
    @{name="Egg Roll"; description="Scrambled eggs wrapped in soft bread"; pricePaise=10000; isVeg=$false; categorySlug="rolls-soups"},
    @{name="Veg Roll"; description="Fresh vegetables wrapped in soft bread"; pricePaise=9000; isVeg=$true; categorySlug="rolls-soups"},
    @{name="Paneer Roll"; description="Cottage cheese wrapped in soft bread"; pricePaise=11000; isVeg=$true; categorySlug="rolls-soups"},
    @{name="Tomato Soup"; description="Perfect soup for cold days"; pricePaise=8000; isVeg=$true; categorySlug="rolls-soups"},
    @{name="Chicken Soup"; description="Hearty chicken soup"; pricePaise=10000; isVeg=$false; categorySlug="rolls-soups"},
    @{name="Vegetable Soup"; description="Fresh vegetable soup"; pricePaise=8000; isVeg=$true; categorySlug="rolls-soups"},
    @{name="Corn Soup"; description="Sweet corn soup"; pricePaise=9000; isVeg=$true; categorySlug="rolls-soups"},
    
    # Our Specials
    @{name="Chef Special Pasta"; description="Our signature pasta creation"; pricePaise=18000; isVeg=$true; categorySlug="our-specials"},
    @{name="Special Chicken Curry"; description="Chef special chicken curry"; pricePaise=20000; isVeg=$false; categorySlug="our-specials"},
    @{name="Rapchai Special Rice"; description="Our unique rice preparation"; pricePaise=16000; isVeg=$true; categorySlug="our-specials"},
    @{name="Special Veggie Bowl"; description="Healthy vegetable bowl"; pricePaise=15000; isVeg=$true; categorySlug="our-specials"},
    @{name="Chef Special Wrap"; description="Our signature wrap creation"; pricePaise=14000; isVeg=$true; categorySlug="our-specials"},
    @{name="Special Fish Fry"; description="Chef special fish preparation"; pricePaise=22000; isVeg=$false; categorySlug="our-specials"},
    
    # Our Squares
    @{name="Spicy Squares"; description="Homemade spicy biscuits"; pricePaise=3000; isVeg=$true; categorySlug="our-squares"},
    @{name="Buttery Squares"; description="Rich buttery homemade biscuits"; pricePaise=3000; isVeg=$true; categorySlug="our-squares"},
    @{name="Fruity Squares"; description="Sweet fruity homemade biscuits"; pricePaise=3000; isVeg=$true; categorySlug="our-squares"},
    @{name="Chocolate Squares"; description="Chocolate-flavored homemade biscuits"; pricePaise=3500; isVeg=$true; categorySlug="our-squares"},
    @{name="Mixed Squares"; description="Assorted homemade biscuits"; pricePaise=4000; isVeg=$true; categorySlug="our-squares"}
)

$successCount = 0
$errorCount = 0

Write-Host "`n📝 Adding $($rapchaiMenu.Count) Rapchai menu items..." -ForegroundColor Yellow

foreach ($item in $rapchaiMenu) {
    try {
        $jsonBody = $item | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/menu-items" -Method POST -Headers $headers -Body $jsonBody
        $successCount++
        Write-Host "✅ $($item.name) - ₹$($item.pricePaise/100)" -ForegroundColor Green
    } catch {
        $errorCount++
        Write-Host "❌ Failed: $($item.name)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Rapchai Menu Addition Complete!" -ForegroundColor Green
Write-Host "📊 Results:" -ForegroundColor Cyan
Write-Host "   ✅ Successfully added: $successCount items" -ForegroundColor Green
Write-Host "   ❌ Failed: $errorCount items" -ForegroundColor Red

# Verify final count
$finalCheck = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/menu-items" -Method GET -Headers $headers
Write-Host "`n📈 Total menu items in database: $($finalCheck.pagination.total)" -ForegroundColor Yellow
Write-Host "🚀 Your affordable vibrant cafe menu is ready!" -ForegroundColor Green
