const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  // Create admin user with your credentials
  const adminEmail = "chandu.kalluru@outlook.com";
  const adminPassword = "Kalluru@145";
  const adminPasswordHash = await argon2.hash(adminPassword);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { 
      role: "ADMIN", 
      passwordHash: adminPasswordHash,
      name: "Chandu Kalluru"
    },
    create: { 
      email: adminEmail, 
      name: "Chandu Kalluru", 
      role: "ADMIN", 
      passwordHash: adminPasswordHash 
    },
  });

  console.log('✅ Admin user created/updated:', adminUser.email);

  // Create comprehensive categories
  const categories = [
    {
      name: "Hot Beverages",
      slug: "hot-beverages",
      description: "Warm and comforting drinks",
    },
    {
      name: "Cold Beverages",
      slug: "cold-beverages",
      description: "Refreshing cold drinks",
    },
    {
      name: "Appetizers",
      slug: "appetizers", 
      description: "Start your meal with our delicious appetizers",
    },
    {
      name: "Indian Main Course",
      slug: "indian-main-course",
      description: "Authentic Indian dishes",
    },
    {
      name: "Continental Main Course",
      slug: "continental-main-course",
      description: "International cuisine",
    },
    {
      name: "Rice & Biryani",
      slug: "rice-biryani",
      description: "Fragrant rice dishes",
    },
    {
      name: "Breads & Rotis",
      slug: "breads-rotis",
      description: "Fresh breads and rotis",
    },
    {
      name: "Desserts",
      slug: "desserts",
      description: "Sweet treats to end your meal",
    },
    {
      name: "Snacks",
      slug: "snacks",
      description: "Quick bites and snacks",
    },
    {
      name: "Salads",
      slug: "salads",
      description: "Fresh and healthy salads",
    },
  ];

  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: categoryData,
      create: categoryData,
    });
    console.log('✅ Category created:', category.name);
  }

  // Create comprehensive menu items with images
  const menuItems = [
    // Hot Beverages
    {
      name: "Cappuccino",
      description: "Rich espresso with steamed milk foam",
      pricePaise: 18000,
      isVeg: true,
      categorySlug: "hot-beverages",
      imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop",
    },
    {
      name: "Latte",
      description: "Smooth espresso with steamed milk",
      pricePaise: 20000,
      isVeg: true,
      categorySlug: "hot-beverages",
      imageUrl: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400&h=300&fit=crop",
    },
    {
      name: "Masala Chai",
      description: "Traditional spiced tea with milk",
      pricePaise: 8000,
      isVeg: true,
      categorySlug: "hot-beverages",
      imageUrl: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop",
    },
    {
      name: "Green Tea",
      description: "Refreshing green tea",
      pricePaise: 6000,
      isVeg: true,
      categorySlug: "hot-beverages",
      imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
    },
    {
      name: "Hot Chocolate",
      description: "Rich and creamy hot chocolate",
      pricePaise: 15000,
      isVeg: true,
      categorySlug: "hot-beverages",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    },

    // Cold Beverages
    {
      name: "Fresh Orange Juice",
      description: "Freshly squeezed orange juice",
      pricePaise: 12000,
      isVeg: true,
      categorySlug: "cold-beverages",
      imageUrl: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop",
    },
    {
      name: "Mango Lassi",
      description: "Sweet mango yogurt drink",
      pricePaise: 14000,
      isVeg: true,
      categorySlug: "cold-beverages",
      imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
    },
    {
      name: "Iced Coffee",
      description: "Chilled coffee with ice",
      pricePaise: 16000,
      isVeg: true,
      categorySlug: "cold-beverages",
      imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
    },
    {
      name: "Lemonade",
      description: "Fresh lemonade with mint",
      pricePaise: 8000,
      isVeg: true,
      categorySlug: "cold-beverages",
      imageUrl: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop",
    },
    {
      name: "Virgin Mojito",
      description: "Refreshing mint and lime drink",
      pricePaise: 10000,
      isVeg: true,
      categorySlug: "cold-beverages",
      imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop",
    },

    // Appetizers
    {
      name: "Samosa",
      description: "Crispy fried pastry with spiced potato filling",
      pricePaise: 2500,
      isVeg: true,
      categorySlug: "appetizers",
      imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    },
    {
      name: "Paneer Tikka",
      description: "Grilled cottage cheese with spices",
      pricePaise: 18000,
      isVeg: true,
      categorySlug: "appetizers",
      imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
    },
    {
      name: "Chicken Wings",
      description: "Spicy grilled chicken wings",
      pricePaise: 22000,
      isVeg: false,
      categorySlug: "appetizers",
      imageUrl: "https://images.unsplash.com/photo-1567620832904-9fe5cf23db13?w=400&h=300&fit=crop",
    },
    {
      name: "Fish Fingers",
      description: "Crispy fried fish fingers",
      pricePaise: 20000,
      isVeg: false,
      categorySlug: "appetizers",
      imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop",
    },
    {
      name: "Spring Rolls",
      description: "Crispy vegetable spring rolls",
      pricePaise: 15000,
      isVeg: true,
      categorySlug: "appetizers",
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
    },

    // Indian Main Course
    {
      name: "Butter Chicken",
      description: "Tender chicken in creamy tomato sauce",
      pricePaise: 35000,
      isVeg: false,
      categorySlug: "indian-main-course",
      imageUrl: "https://images.unsplash.com/photo-1563379091339-03246963d4d8?w=400&h=300&fit=crop",
    },
    {
      name: "Dal Makhani",
      description: "Creamy black lentils",
      pricePaise: 28000,
      isVeg: true,
      categorySlug: "indian-main-course",
      imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
    },
    {
      name: "Palak Paneer",
      description: "Cottage cheese in spinach gravy",
      pricePaise: 30000,
      isVeg: true,
      categorySlug: "indian-main-course",
      imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
    },
    {
      name: "Chicken Curry",
      description: "Spicy chicken curry with onions",
      pricePaise: 32000,
      isVeg: false,
      categorySlug: "indian-main-course",
      imageUrl: "https://images.unsplash.com/photo-1563379091339-03246963d4d8?w=400&h=300&fit=crop",
    },
    {
      name: "Rajma Masala",
      description: "Red kidney beans in spicy gravy",
      pricePaise: 25000,
      isVeg: true,
      categorySlug: "indian-main-course",
      imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
    },

    // Continental Main Course
    {
      name: "Grilled Chicken",
      description: "Herb-marinated grilled chicken breast",
      pricePaise: 40000,
      isVeg: false,
      categorySlug: "continental-main-course",
      imageUrl: "https://images.unsplash.com/photo-1567620832904-9fe5cf23db13?w=400&h=300&fit=crop",
    },
    {
      name: "Pasta Alfredo",
      description: "Creamy pasta with parmesan cheese",
      pricePaise: 32000,
      isVeg: true,
      categorySlug: "continental-main-course",
      imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=400&h=300&fit=crop",
    },
    {
      name: "Fish & Chips",
      description: "Beer-battered fish with crispy fries",
      pricePaise: 35000,
      isVeg: false,
      categorySlug: "continental-main-course",
      imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop",
    },
    {
      name: "Margherita Pizza",
      description: "Classic pizza with tomato and mozzarella",
      pricePaise: 30000,
      isVeg: true,
      categorySlug: "continental-main-course",
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    },
    {
      name: "Beef Steak",
      description: "Grilled beef steak with herbs",
      pricePaise: 45000,
      isVeg: false,
      categorySlug: "continental-main-course",
      imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
    },

    // Rice & Biryani
    {
      name: "Chicken Biryani",
      description: "Fragrant basmati rice with spiced chicken",
      pricePaise: 32000,
      isVeg: false,
      categorySlug: "rice-biryani",
      imageUrl: "https://images.unsplash.com/photo-1563379091339-03246963d4d8?w=400&h=300&fit=crop",
    },
    {
      name: "Vegetable Biryani",
      description: "Aromatic rice with mixed vegetables",
      pricePaise: 28000,
      isVeg: true,
      categorySlug: "rice-biryani",
      imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
    },
    {
      name: "Jeera Rice",
      description: "Basmati rice tempered with cumin",
      pricePaise: 12000,
      isVeg: true,
      categorySlug: "rice-biryani",
      imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    },
    {
      name: "Mutton Biryani",
      description: "Rich mutton biryani with saffron",
      pricePaise: 38000,
      isVeg: false,
      categorySlug: "rice-biryani",
      imageUrl: "https://images.unsplash.com/photo-1563379091339-03246963d4d8?w=400&h=300&fit=crop",
    },
    {
      name: "Fried Rice",
      description: "Chinese-style fried rice with vegetables",
      pricePaise: 20000,
      isVeg: true,
      categorySlug: "rice-biryani",
      imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    },

    // Breads & Rotis
    {
      name: "Naan",
      description: "Soft leavened bread",
      pricePaise: 8000,
      isVeg: true,
      categorySlug: "breads-rotis",
      imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    },
    {
      name: "Roti",
      description: "Whole wheat flatbread",
      pricePaise: 5000,
      isVeg: true,
      categorySlug: "breads-rotis",
      imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    },
    {
      name: "Garlic Naan",
      description: "Naan bread with garlic and herbs",
      pricePaise: 10000,
      isVeg: true,
      categorySlug: "breads-rotis",
      imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    },
    {
      name: "Butter Naan",
      description: "Naan bread with butter",
      pricePaise: 12000,
      isVeg: true,
      categorySlug: "breads-rotis",
      imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    },
    {
      name: "Paratha",
      description: "Layered flatbread",
      pricePaise: 8000,
      isVeg: true,
      categorySlug: "breads-rotis",
      imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    },

    // Desserts
    {
      name: "Gulab Jamun",
      description: "Sweet milk dumplings in rose syrup",
      pricePaise: 12000,
      isVeg: true,
      categorySlug: "desserts",
      imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    },
    {
      name: "Tiramisu",
      description: "Classic Italian dessert",
      pricePaise: 25000,
      isVeg: true,
      categorySlug: "desserts",
      imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
    },
    {
      name: "Chocolate Cake",
      description: "Rich chocolate cake",
      pricePaise: 20000,
      isVeg: true,
      categorySlug: "desserts",
      imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    },
    {
      name: "Ice Cream",
      description: "Vanilla ice cream",
      pricePaise: 8000,
      isVeg: true,
      categorySlug: "desserts",
      imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop",
    },
    {
      name: "Ras Malai",
      description: "Cottage cheese dumplings in sweet milk",
      pricePaise: 15000,
      isVeg: true,
      categorySlug: "desserts",
      imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    },

    // Snacks
    {
      name: "Pakora",
      description: "Deep-fried vegetable fritters",
      pricePaise: 12000,
      isVeg: true,
      categorySlug: "snacks",
      imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    },
    {
      name: "Vada Pav",
      description: "Spicy potato fritter in bread",
      pricePaise: 8000,
      isVeg: true,
      categorySlug: "snacks",
      imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    },
    {
      name: "Chicken Burger",
      description: "Grilled chicken burger",
      pricePaise: 25000,
      isVeg: false,
      categorySlug: "snacks",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    },
    {
      name: "French Fries",
      description: "Crispy golden french fries",
      pricePaise: 10000,
      isVeg: true,
      categorySlug: "snacks",
      imageUrl: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&h=300&fit=crop",
    },
    {
      name: "Onion Rings",
      description: "Crispy battered onion rings",
      pricePaise: 12000,
      isVeg: true,
      categorySlug: "snacks",
      imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    },

    // Salads
    {
      name: "Caesar Salad",
      description: "Fresh lettuce with caesar dressing",
      pricePaise: 18000,
      isVeg: true,
      categorySlug: "salads",
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    },
    {
      name: "Greek Salad",
      description: "Fresh vegetables with feta cheese",
      pricePaise: 20000,
      isVeg: true,
      categorySlug: "salads",
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    },
    {
      name: "Chicken Salad",
      description: "Grilled chicken with mixed greens",
      pricePaise: 25000,
      isVeg: false,
      categorySlug: "salads",
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    },
    {
      name: "Fruit Salad",
      description: "Fresh seasonal fruits",
      pricePaise: 15000,
      isVeg: true,
      categorySlug: "salads",
      imageUrl: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop",
    },
    {
      name: "Quinoa Salad",
      description: "Healthy quinoa with vegetables",
      pricePaise: 22000,
      isVeg: true,
      categorySlug: "salads",
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    },
  ];

  for (const itemData of menuItems) {
    const category = await prisma.category.findUnique({
      where: { slug: itemData.categorySlug },
    });

    if (category) {
      const { categorySlug, ...itemDataWithoutSlug } = itemData;
      const menuItem = await prisma.menuItem.create({
        data: {
          ...itemDataWithoutSlug,
          categoryId: category.id,
        },
      });
      console.log('✅ Menu item created:', menuItem.name);
    }
  }

  // Create sample events
  const events = [
    {
      id: "live-music-night",
      title: "Live Music Night",
      description: "Enjoy live acoustic music while dining",
      startAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
      location: "Main Dining Hall",
      maxCapacity: 50,
    },
    {
      id: "weekend-brunch",
      title: "Weekend Brunch Special",
      description: "Special brunch menu with live cooking",
      startAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      endAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
      location: "Outdoor Terrace",
      maxCapacity: 30,
    },
    {
      id: "wine-tasting",
      title: "Wine Tasting Evening",
      description: "Premium wine tasting with cheese platter",
      startAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      endAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      location: "Private Dining Room",
      maxCapacity: 20,
    },
  ];

  for (const eventData of events) {
    const event = await prisma.event.upsert({
      where: { id: eventData.id },
      update: eventData,
      create: eventData,
    });
    console.log('✅ Event created:', event.title);
  }

  // Create sample orders
  const sampleOrders = [
    {
      customerName: "Rajesh Kumar",
      customerPhone: "+91-9876543210",
      customerEmail: "rajesh@example.com",
      orderType: "DINE_IN",
      status: "CONFIRMED",
      paymentStatus: "PAID",
      totalAmountPaise: 45000,
    },
    {
      customerName: "Priya Sharma",
      customerPhone: "+91-9876543211",
      customerEmail: "priya@example.com",
      orderType: "TAKEAWAY",
      status: "PREPARING",
      paymentStatus: "PENDING",
      totalAmountPaise: 32000,
    },
    {
      customerName: "Amit Singh",
      customerPhone: "+91-9876543212",
      customerEmail: "amit@example.com",
      orderType: "DELIVERY",
      status: "DELIVERED",
      paymentStatus: "PAID",
      totalAmountPaise: 28000,
    },
  ];

  // Get some menu items to create realistic orders
  const menuItemsForOrders = await prisma.menuItem.findMany({ take: 10 });
  
  for (let i = 0; i < sampleOrders.length; i++) {
    const orderData = sampleOrders[i];
    const randomMenuItem = menuItemsForOrders[i % menuItemsForOrders.length];
    
    const order = await prisma.order.create({
      data: {
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail,
        orderType: orderData.orderType,
        status: orderData.status,
        paymentStatus: orderData.paymentStatus,
        totalAmountPaise: orderData.totalAmountPaise,
        items: {
          create: [
            {
              menuItemId: randomMenuItem.id,
              quantity: 1,
              pricePaise: randomMenuItem.pricePaise,
            },
          ],
        },
      },
    });
    console.log('✅ Order created for:', order.customerName);
  }

  console.log('🎉 Comprehensive database seeding completed successfully!');
  console.log(`📊 Created:`);
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${menuItems.length} menu items`);
  console.log(`   - ${events.length} events`);
  console.log(`   - ${sampleOrders.length} sample orders`);
  console.log(`   - 1 admin user`);
}

main()
.then(async () => {
  await prisma.$disconnect();
})
.catch(async (e) => {
  console.error('❌ Seeding failed:', e);
  await prisma.$disconnect();
  process.exit(1);
});
