# Verify Supabase Database Content
Write-Host "🔍 Verifying Supabase database content..." -ForegroundColor Green

# Get fresh token
$loginBody = '{"email":"chandu.kalluru@outlook.com","password":"Kalluru@145"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$adminToken = $loginResponse.accessToken
$headers = @{"Authorization"="Bearer $adminToken"; "Content-Type"="application/json"}

# Check categories
$categories = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/categories" -Method GET -Headers $headers
Write-Host "📂 Categories: $($categories.categories.Count)" -ForegroundColor Yellow
foreach ($cat in $categories.categories) {
    Write-Host "   - $($cat.name)" -ForegroundColor White
}

# Check menu items
$menuItems = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/menu-items" -Method GET -Headers $headers
Write-Host "`n🍽️ Menu Items: $($menuItems.menuItems.Count) (showing), Total: $($menuItems.pagination.total)" -ForegroundColor Yellow
foreach ($item in $menuItems.menuItems) {
    Write-Host "   - $($item.name) (₹$($item.pricePaise/100))" -ForegroundColor White
}

Write-Host "`n✅ Database verification complete!" -ForegroundColor Green
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   Categories: $($categories.categories.Count)" -ForegroundColor White
Write-Host "   Menu Items: $($menuItems.pagination.total)" -ForegroundColor White
Write-Host "`n🌐 You can also check Prisma Studio at: http://localhost:5556" -ForegroundColor Green
