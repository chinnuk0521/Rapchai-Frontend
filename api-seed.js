const fetch = require('node-fetch').default || require('node-fetch');

const API_BASE_URL = 'http://localhost:3001/api';
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhiMnFpM3EwMDAwbDUwMHZ5OXR5cG5oIiwiZW1haWwiOiJjaGFuZHUua2FsbHVydUBvdXRsb29rLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2MTY4Njg1MywiZXhwIjoxNzYxNjg3NzUzLCJhdWQiOiJyYXBjaGFpLWNsaWVudCIsImlzcyI6InJhcGNoYWktYXBpIn0.ELzazSbky1ffAYuhXEgeMIvH6SKQA7kaqxeiddqa4-Q';

async function seedData() {
  console.log('🌱 Starting data seeding via API...');

  try {
    // First, add categories
    console.log('Adding categories...');
    const categories = [
      { name: 'Hot Beverages', slug: 'hot-beverages', description: 'Warm drinks' },
      { name: 'Cold Beverages', slug: 'cold-beverages', description: 'Cold drinks' },
      { name: 'Appetizers', slug: 'appetizers', description: 'Starters' },
      { name: 'Main Course', slug: 'main-course', description: 'Main dishes' },
      { name: 'Desserts', slug: 'desserts', description: 'Sweet treats' }
    ];

    for (const category of categories) {
      const response = await fetch(`${API_BASE_URL}/admin/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Category created: ${result.category.name}`);
      } else {
        const error = await response.text();
        console.log(`⚠️ Category ${category.name} might already exist: ${error}`);
      }
    }

    // Wait a moment for categories to be created
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Now add menu items
    console.log('Adding menu items...');
    const menuItems = [
      { name: 'Cappuccino', description: 'Rich espresso with steamed milk foam', pricePaise: 18000, isVeg: true, categorySlug: 'hot-beverages' },
      { name: 'Masala Chai', description: 'Traditional spiced tea with milk', pricePaise: 8000, isVeg: true, categorySlug: 'hot-beverages' },
      { name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice', pricePaise: 12000, isVeg: true, categorySlug: 'cold-beverages' },
      { name: 'Mango Lassi', description: 'Sweet mango yogurt drink', pricePaise: 14000, isVeg: true, categorySlug: 'cold-beverages' },
      { name: 'Samosa', description: 'Crispy fried pastry with spiced potato filling', pricePaise: 2500, isVeg: true, categorySlug: 'appetizers' },
      { name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', pricePaise: 18000, isVeg: true, categorySlug: 'appetizers' },
      { name: 'Chicken Wings', description: 'Spicy grilled chicken wings', pricePaise: 22000, isVeg: false, categorySlug: 'appetizers' },
      { name: 'Butter Chicken', description: 'Tender chicken in creamy tomato sauce', pricePaise: 35000, isVeg: false, categorySlug: 'main-course' },
      { name: 'Dal Makhani', description: 'Creamy black lentils', pricePaise: 28000, isVeg: true, categorySlug: 'main-course' },
      { name: 'Chicken Biryani', description: 'Fragrant basmati rice with spiced chicken', pricePaise: 32000, isVeg: false, categorySlug: 'main-course' },
      { name: 'Naan', description: 'Soft leavened bread', pricePaise: 8000, isVeg: true, categorySlug: 'main-course' },
      { name: 'Gulab Jamun', description: 'Sweet milk dumplings in rose syrup', pricePaise: 12000, isVeg: true, categorySlug: 'desserts' },
      { name: 'Ice Cream', description: 'Vanilla ice cream', pricePaise: 8000, isVeg: true, categorySlug: 'desserts' },
      { name: 'Chocolate Cake', description: 'Rich chocolate cake', pricePaise: 20000, isVeg: true, categorySlug: 'desserts' },
      { name: 'Tiramisu', description: 'Classic Italian dessert', pricePaise: 25000, isVeg: true, categorySlug: 'desserts' }
    ];

    for (const item of menuItems) {
      const response = await fetch(`${API_BASE_URL}/admin/menu-items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Menu item created: ${result.menuItem.name}`);
      } else {
        const error = await response.text();
        console.log(`❌ Failed to create ${item.name}: ${error}`);
      }
    }

    console.log('🎉 Data seeding completed successfully!');
    console.log(`📊 Created:`);
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${menuItems.length} menu items`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seedData();
