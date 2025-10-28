# Quick Menu Items Addition
$loginBody = '{"email":"chandu.kalluru@outlook.com","password":"Kalluru@145"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$adminToken = $loginResponse.accessToken
$headers = @{"Authorization"="Bearer $adminToken"; "Content-Type"="application/json"}

# Hot Beverages
$items = @(
'{"name":"Masala Chai","description":"Traditional spiced tea with milk","pricePaise":8000,"isVeg":true,"categorySlug":"hot-beverages"}',
'{"name":"Hot Chocolate","description":"Rich and creamy hot chocolate","pricePaise":15000,"isVeg":true,"categorySlug":"hot-beverages"}',
'{"name":"Green Tea","description":"Refreshing green tea","pricePaise":6000,"isVeg":true,"categorySlug":"hot-beverages"}',
'{"name":"Coffee Latte","description":"Smooth coffee with steamed milk","pricePaise":16000,"isVeg":true,"categorySlug":"hot-beverages"}',
'{"name":"Black Tea","description":"Classic black tea","pricePaise":5000,"isVeg":true,"categorySlug":"hot-beverages"}',
'{"name":"Herbal Tea","description":"Soothing herbal tea blend","pricePaise":7000,"isVeg":true,"categorySlug":"hot-beverages"}',
'{"name":"Espresso","description":"Strong and bold espresso shot","pricePaise":12000,"isVeg":true,"categorySlug":"hot-beverages"}',
'{"name":"Americano","description":"Espresso with hot water","pricePaise":10000,"isVeg":true,"categorySlug":"hot-beverages"}',
'{"name":"Mocha","description":"Coffee with chocolate and milk","pricePaise":20000,"isVeg":true,"categorySlug":"hot-beverages"}',

# Cold Beverages
'{"name":"Fresh Orange Juice","description":"Freshly squeezed orange juice","pricePaise":12000,"isVeg":true,"categorySlug":"cold-beverages"}',
'{"name":"Mango Lassi","description":"Sweet mango yogurt drink","pricePaise":14000,"isVeg":true,"categorySlug":"cold-beverages"}',
'{"name":"Cold Coffee","description":"Iced coffee with milk","pricePaise":15000,"isVeg":true,"categorySlug":"cold-beverages"}',
'{"name":"Lemonade","description":"Fresh lemonade","pricePaise":8000,"isVeg":true,"categorySlug":"cold-beverages"}',
'{"name":"Pineapple Juice","description":"Fresh pineapple juice","pricePaise":13000,"isVeg":true,"categorySlug":"cold-beverages"}',
'{"name":"Coconut Water","description":"Fresh coconut water","pricePaise":10000,"isVeg":true,"categorySlug":"cold-beverages"}',
'{"name":"Strawberry Smoothie","description":"Creamy strawberry smoothie","pricePaise":18000,"isVeg":true,"categorySlug":"cold-beverages"}',
'{"name":"Banana Shake","description":"Rich banana milkshake","pricePaise":16000,"isVeg":true,"categorySlug":"cold-beverages"}',
'{"name":"Chocolate Shake","description":"Decadent chocolate milkshake","pricePaise":20000,"isVeg":true,"categorySlug":"cold-beverages"}',
'{"name":"Iced Tea","description":"Refreshing iced tea","pricePaise":9000,"isVeg":true,"categorySlug":"cold-beverages"}',

# Appetizers
'{"name":"Samosa","description":"Crispy fried pastry with spiced potato filling","pricePaise":2500,"isVeg":true,"categorySlug":"appetizers"}',
'{"name":"Paneer Tikka","description":"Grilled cottage cheese with spices","pricePaise":18000,"isVeg":true,"categorySlug":"appetizers"}',
'{"name":"Chicken Wings","description":"Spicy grilled chicken wings","pricePaise":22000,"isVeg":false,"categorySlug":"appetizers"}',
'{"name":"Spring Rolls","description":"Crispy vegetable spring rolls","pricePaise":12000,"isVeg":true,"categorySlug":"appetizers"}',
'{"name":"Fish Fingers","description":"Crispy fried fish fingers","pricePaise":20000,"isVeg":false,"categorySlug":"appetizers"}',
'{"name":"Chicken Tikka","description":"Tender grilled chicken pieces","pricePaise":25000,"isVeg":false,"categorySlug":"appetizers"}',
'{"name":"Veg Cutlet","description":"Spiced vegetable cutlets","pricePaise":8000,"isVeg":true,"categorySlug":"appetizers"}',
'{"name":"Chicken Nuggets","description":"Crispy chicken nuggets","pricePaise":15000,"isVeg":false,"categorySlug":"appetizers"}',
'{"name":"Onion Rings","description":"Crispy fried onion rings","pricePaise":10000,"isVeg":true,"categorySlug":"appetizers"}',
'{"name":"Mushroom Tikka","description":"Grilled mushroom with spices","pricePaise":16000,"isVeg":true,"categorySlug":"appetizers"}',

# Main Course
'{"name":"Butter Chicken","description":"Tender chicken in creamy tomato sauce","pricePaise":35000,"isVeg":false,"categorySlug":"main-course"}',
'{"name":"Dal Makhani","description":"Creamy black lentils","pricePaise":28000,"isVeg":true,"categorySlug":"main-course"}',
'{"name":"Chicken Curry","description":"Spicy chicken curry","pricePaise":32000,"isVeg":false,"categorySlug":"main-course"}',
'{"name":"Paneer Butter Masala","description":"Cottage cheese in creamy tomato sauce","pricePaise":30000,"isVeg":true,"categorySlug":"main-course"}',
'{"name":"Fish Curry","description":"Spicy fish curry","pricePaise":38000,"isVeg":false,"categorySlug":"main-course"}',
'{"name":"Chole Bhature","description":"Spiced chickpeas with fried bread","pricePaise":25000,"isVeg":true,"categorySlug":"main-course"}',
'{"name":"Mutton Curry","description":"Rich mutton curry","pricePaise":45000,"isVeg":false,"categorySlug":"main-course"}',
'{"name":"Rajma Masala","description":"Spiced kidney beans","pricePaise":22000,"isVeg":true,"categorySlug":"main-course"}',
'{"name":"Chicken Biryani","description":"Fragrant basmati rice with spiced chicken","pricePaise":32000,"isVeg":false,"categorySlug":"main-course"}',
'{"name":"Veg Biryani","description":"Fragrant basmati rice with vegetables","pricePaise":28000,"isVeg":true,"categorySlug":"main-course"}',

# Desserts
'{"name":"Gulab Jamun","description":"Sweet milk dumplings in rose syrup","pricePaise":12000,"isVeg":true,"categorySlug":"desserts"}',
'{"name":"Rasgulla","description":"Soft cottage cheese balls in syrup","pricePaise":10000,"isVeg":true,"categorySlug":"desserts"}',
'{"name":"Kheer","description":"Rice pudding with nuts","pricePaise":15000,"isVeg":true,"categorySlug":"desserts"}',
'{"name":"Chocolate Cake","description":"Rich chocolate cake","pricePaise":20000,"isVeg":true,"categorySlug":"desserts"}',
'{"name":"Tiramisu","description":"Classic Italian dessert","pricePaise":25000,"isVeg":true,"categorySlug":"desserts"}',
'{"name":"Cheesecake","description":"Creamy cheesecake","pricePaise":22000,"isVeg":true,"categorySlug":"desserts"}',
'{"name":"Brownie","description":"Chocolate brownie with ice cream","pricePaise":18000,"isVeg":true,"categorySlug":"desserts"}',
'{"name":"Halwa","description":"Sweet semolina pudding","pricePaise":14000,"isVeg":true,"categorySlug":"desserts"}',
'{"name":"Jalebi","description":"Crispy sweet spirals","pricePaise":8000,"isVeg":true,"categorySlug":"desserts"}',
'{"name":"Ladoo","description":"Sweet round balls","pricePaise":6000,"isVeg":true,"categorySlug":"desserts"}'
)

$successCount = 0
foreach ($item in $items) {
    try {
        Invoke-RestMethod -Uri "http://localhost:3001/api/admin/menu-items" -Method POST -Headers $headers -Body $item | Out-Null
        $successCount++
        Write-Host "✅ Item $successCount created successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to create item" -ForegroundColor Red
    }
}

Write-Host "🎉 Successfully created $successCount menu items!" -ForegroundColor Green
