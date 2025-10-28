const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding for Supabase...');

  try {
    // 1. Create Admin Users (10+ users)
    console.log('👥 Creating users...');
    const users = [
      {
        email: 'chandu.kalluru@outlook.com',
        name: 'Chandu Kalluru',
        role: 'ADMIN',
        password: 'Kalluru@145'
      },
      {
        email: 'admin@rapchai.com',
        name: 'Admin User',
        role: 'ADMIN',
        password: 'Admin@123'
      },
      {
        email: 'manager@rapchai.com',
        name: 'Restaurant Manager',
        role: 'STAFF',
        password: 'Manager@123'
      },
      {
        email: 'staff1@rapchai.com',
        name: 'Staff Member 1',
        role: 'STAFF',
        password: 'Staff@123'
      },
      {
        email: 'staff2@rapchai.com',
        name: 'Staff Member 2',
        role: 'STAFF',
        password: 'Staff@123'
      },
      {
        email: 'customer1@gmail.com',
        name: 'Rajesh Kumar',
        role: 'CUSTOMER',
        password: 'Customer@123'
      },
      {
        email: 'customer2@gmail.com',
        name: 'Priya Sharma',
        role: 'CUSTOMER',
        password: 'Customer@123'
      },
      {
        email: 'customer3@gmail.com',
        name: 'Amit Patel',
        role: 'CUSTOMER',
        password: 'Customer@123'
      },
      {
        email: 'customer4@gmail.com',
        name: 'Sneha Reddy',
        role: 'CUSTOMER',
        password: 'Customer@123'
      },
      {
        email: 'customer5@gmail.com',
        name: 'Vikram Singh',
        role: 'CUSTOMER',
        password: 'Customer@123'
      },
      {
        email: 'customer6@gmail.com',
        name: 'Anita Gupta',
        role: 'CUSTOMER',
        password: 'Customer@123'
      },
      {
        email: 'customer7@gmail.com',
        name: 'Rohit Verma',
        role: 'CUSTOMER',
        password: 'Customer@123'
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const passwordHash = await argon2.hash(userData.password);
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          name: userData.name,
          role: userData.role,
          passwordHash: passwordHash
        },
        create: {
          email: userData.email,
          name: userData.name,
          role: userData.role,
          passwordHash: passwordHash
        },
      });
      createdUsers.push(user);
      console.log(`✅ User created: ${user.name} (${user.role})`);
    }

    // 2. Create Categories (10+ categories)
    console.log('📂 Creating categories...');
    const categories = [
      { name: 'Hot Beverages', slug: 'hot-beverages', description: 'Warm and comforting drinks', sortOrder: 1 },
      { name: 'Cold Beverages', slug: 'cold-beverages', description: 'Refreshing cold drinks', sortOrder: 2 },
      { name: 'Appetizers', slug: 'appetizers', description: 'Start your meal right', sortOrder: 3 },
      { name: 'Soups', slug: 'soups', description: 'Hearty and warming soups', sortOrder: 4 },
      { name: 'Salads', slug: 'salads', description: 'Fresh and healthy salads', sortOrder: 5 },
      { name: 'Main Course', slug: 'main-course', description: 'Hearty main dishes', sortOrder: 6 },
      { name: 'Rice & Biryani', slug: 'rice-biryani', description: 'Fragrant rice dishes', sortOrder: 7 },
      { name: 'Bread & Roti', slug: 'bread-roti', description: 'Fresh bread and rotis', sortOrder: 8 },
      { name: 'Desserts', slug: 'desserts', description: 'Sweet endings', sortOrder: 9 },
      { name: 'Ice Creams', slug: 'ice-creams', description: 'Cool and creamy treats', sortOrder: 10 },
      { name: 'Snacks', slug: 'snacks', description: 'Quick bites and snacks', sortOrder: 11 },
      { name: 'Combo Meals', slug: 'combo-meals', description: 'Complete meal deals', sortOrder: 12 }
    ];

    const createdCategories = [];
    for (const categoryData of categories) {
      const category = await prisma.category.upsert({
        where: { slug: categoryData.slug },
        update: categoryData,
        create: categoryData,
      });
      createdCategories.push(category);
      console.log(`✅ Category created: ${category.name}`);
    }

    // 3. Create Menu Items (50+ items across categories)
    console.log('🍽️ Creating menu items...');
    const menuItems = [
      // Hot Beverages
      { name: 'Cappuccino', description: 'Rich espresso with steamed milk foam', pricePaise: 18000, isVeg: true, categorySlug: 'hot-beverages', calories: 80, prepTime: 5 },
      { name: 'Masala Chai', description: 'Traditional spiced tea with milk', pricePaise: 8000, isVeg: true, categorySlug: 'hot-beverages', calories: 60, prepTime: 3 },
      { name: 'Hot Chocolate', description: 'Rich and creamy hot chocolate', pricePaise: 15000, isVeg: true, categorySlug: 'hot-beverages', calories: 120, prepTime: 4 },
      { name: 'Green Tea', description: 'Refreshing green tea', pricePaise: 6000, isVeg: true, categorySlug: 'hot-beverages', calories: 2, prepTime: 2 },
      { name: 'Coffee Latte', description: 'Smooth coffee with steamed milk', pricePaise: 16000, isVeg: true, categorySlug: 'hot-beverages', calories: 90, prepTime: 4 },
      { name: 'Black Tea', description: 'Classic black tea', pricePaise: 5000, isVeg: true, categorySlug: 'hot-beverages', calories: 2, prepTime: 2 },
      { name: 'Herbal Tea', description: 'Soothing herbal tea blend', pricePaise: 7000, isVeg: true, categorySlug: 'hot-beverages', calories: 5, prepTime: 3 },
      { name: 'Espresso', description: 'Strong and bold espresso shot', pricePaise: 12000, isVeg: true, categorySlug: 'hot-beverages', calories: 5, prepTime: 2 },
      { name: 'Americano', description: 'Espresso with hot water', pricePaise: 10000, isVeg: true, categorySlug: 'hot-beverages', calories: 5, prepTime: 3 },
      { name: 'Mocha', description: 'Coffee with chocolate and milk', pricePaise: 20000, isVeg: true, categorySlug: 'hot-beverages', calories: 150, prepTime: 5 },

      // Cold Beverages
      { name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice', pricePaise: 12000, isVeg: true, categorySlug: 'cold-beverages', calories: 110, prepTime: 3 },
      { name: 'Mango Lassi', description: 'Sweet mango yogurt drink', pricePaise: 14000, isVeg: true, categorySlug: 'cold-beverages', calories: 180, prepTime: 4 },
      { name: 'Cold Coffee', description: 'Iced coffee with milk', pricePaise: 15000, isVeg: true, categorySlug: 'cold-beverages', calories: 100, prepTime: 4 },
      { name: 'Lemonade', description: 'Fresh lemonade', pricePaise: 8000, isVeg: true, categorySlug: 'cold-beverages', calories: 50, prepTime: 2 },
      { name: 'Pineapple Juice', description: 'Fresh pineapple juice', pricePaise: 13000, isVeg: true, categorySlug: 'cold-beverages', calories: 120, prepTime: 3 },
      { name: 'Coconut Water', description: 'Fresh coconut water', pricePaise: 10000, isVeg: true, categorySlug: 'cold-beverages', calories: 20, prepTime: 1 },
      { name: 'Strawberry Smoothie', description: 'Creamy strawberry smoothie', pricePaise: 18000, isVeg: true, categorySlug: 'cold-beverages', calories: 200, prepTime: 5 },
      { name: 'Banana Shake', description: 'Rich banana milkshake', pricePaise: 16000, isVeg: true, categorySlug: 'cold-beverages', calories: 180, prepTime: 4 },
      { name: 'Chocolate Shake', description: 'Decadent chocolate milkshake', pricePaise: 20000, isVeg: true, categorySlug: 'cold-beverages', calories: 250, prepTime: 5 },
      { name: 'Iced Tea', description: 'Refreshing iced tea', pricePaise: 9000, isVeg: true, categorySlug: 'cold-beverages', calories: 30, prepTime: 3 },

      // Appetizers
      { name: 'Samosa', description: 'Crispy fried pastry with spiced potato filling', pricePaise: 2500, isVeg: true, categorySlug: 'appetizers', calories: 150, prepTime: 8 },
      { name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', pricePaise: 18000, isVeg: true, categorySlug: 'appetizers', calories: 200, prepTime: 15 },
      { name: 'Chicken Wings', description: 'Spicy grilled chicken wings', pricePaise: 22000, isVeg: false, categorySlug: 'appetizers', calories: 300, prepTime: 20 },
      { name: 'Spring Rolls', description: 'Crispy vegetable spring rolls', pricePaise: 12000, isVeg: true, categorySlug: 'appetizers', calories: 120, prepTime: 10 },
      { name: 'Fish Fingers', description: 'Crispy fried fish fingers', pricePaise: 20000, isVeg: false, categorySlug: 'appetizers', calories: 250, prepTime: 12 },
      { name: 'Chicken Tikka', description: 'Tender grilled chicken pieces', pricePaise: 25000, isVeg: false, categorySlug: 'appetizers', calories: 280, prepTime: 18 },
      { name: 'Veg Cutlet', description: 'Spiced vegetable cutlets', pricePaise: 8000, isVeg: true, categorySlug: 'appetizers', calories: 180, prepTime: 12 },
      { name: 'Chicken Nuggets', description: 'Crispy chicken nuggets', pricePaise: 15000, isVeg: false, categorySlug: 'appetizers', calories: 220, prepTime: 10 },
      { name: 'Onion Rings', description: 'Crispy fried onion rings', pricePaise: 10000, isVeg: true, categorySlug: 'appetizers', calories: 160, prepTime: 8 },
      { name: 'Mushroom Tikka', description: 'Grilled mushroom with spices', pricePaise: 16000, isVeg: true, categorySlug: 'appetizers', calories: 120, prepTime: 15 },

      // Soups
      { name: 'Tomato Soup', description: 'Creamy tomato soup', pricePaise: 12000, isVeg: true, categorySlug: 'soups', calories: 80, prepTime: 10 },
      { name: 'Chicken Soup', description: 'Hearty chicken soup', pricePaise: 15000, isVeg: false, categorySlug: 'soups', calories: 120, prepTime: 15 },
      { name: 'Vegetable Soup', description: 'Mixed vegetable soup', pricePaise: 10000, isVeg: true, categorySlug: 'soups', calories: 60, prepTime: 12 },
      { name: 'Corn Soup', description: 'Sweet corn soup', pricePaise: 11000, isVeg: true, categorySlug: 'soups', calories: 70, prepTime: 8 },
      { name: 'Mushroom Soup', description: 'Creamy mushroom soup', pricePaise: 13000, isVeg: true, categorySlug: 'soups', calories: 90, prepTime: 10 },
      { name: 'Dal Soup', description: 'Spiced lentil soup', pricePaise: 9000, isVeg: true, categorySlug: 'soups', calories: 100, prepTime: 15 },
      { name: 'Hot & Sour Soup', description: 'Spicy hot and sour soup', pricePaise: 14000, isVeg: true, categorySlug: 'soups', calories: 85, prepTime: 12 },
      { name: 'Chicken Noodle Soup', description: 'Comforting chicken noodle soup', pricePaise: 16000, isVeg: false, categorySlug: 'soups', calories: 150, prepTime: 18 },
      { name: 'Minestrone Soup', description: 'Italian vegetable soup', pricePaise: 15000, isVeg: true, categorySlug: 'soups', calories: 110, prepTime: 20 },
      { name: 'Cream of Broccoli', description: 'Rich broccoli soup', pricePaise: 12000, isVeg: true, categorySlug: 'soups', calories: 95, prepTime: 12 },

      // Main Course
      { name: 'Butter Chicken', description: 'Tender chicken in creamy tomato sauce', pricePaise: 35000, isVeg: false, categorySlug: 'main-course', calories: 450, prepTime: 25 },
      { name: 'Dal Makhani', description: 'Creamy black lentils', pricePaise: 28000, isVeg: true, categorySlug: 'main-course', calories: 300, prepTime: 30 },
      { name: 'Chicken Curry', description: 'Spicy chicken curry', pricePaise: 32000, isVeg: false, categorySlug: 'main-course', calories: 400, prepTime: 25 },
      { name: 'Paneer Butter Masala', description: 'Cottage cheese in creamy tomato sauce', pricePaise: 30000, isVeg: true, categorySlug: 'main-course', calories: 350, prepTime: 20 },
      { name: 'Fish Curry', description: 'Spicy fish curry', pricePaise: 38000, isVeg: false, categorySlug: 'main-course', calories: 320, prepTime: 22 },
      { name: 'Chole Bhature', description: 'Spiced chickpeas with fried bread', pricePaise: 25000, isVeg: true, categorySlug: 'main-course', calories: 500, prepTime: 20 },
      { name: 'Mutton Curry', description: 'Rich mutton curry', pricePaise: 45000, isVeg: false, categorySlug: 'main-course', calories: 500, prepTime: 35 },
      { name: 'Rajma Masala', description: 'Spiced kidney beans', pricePaise: 22000, isVeg: true, categorySlug: 'main-course', calories: 280, prepTime: 25 },
      { name: 'Chicken Biryani', description: 'Fragrant basmati rice with spiced chicken', pricePaise: 32000, isVeg: false, categorySlug: 'main-course', calories: 600, prepTime: 30 },
      { name: 'Veg Biryani', description: 'Fragrant basmati rice with vegetables', pricePaise: 28000, isVeg: true, categorySlug: 'main-course', calories: 450, prepTime: 25 },

      // Bread & Roti
      { name: 'Naan', description: 'Soft leavened bread', pricePaise: 8000, isVeg: true, categorySlug: 'bread-roti', calories: 200, prepTime: 5 },
      { name: 'Roti', description: 'Whole wheat flatbread', pricePaise: 5000, isVeg: true, categorySlug: 'bread-roti', calories: 150, prepTime: 3 },
      { name: 'Garlic Naan', description: 'Naan with garlic and herbs', pricePaise: 10000, isVeg: true, categorySlug: 'bread-roti', calories: 220, prepTime: 6 },
      { name: 'Butter Naan', description: 'Naan with butter', pricePaise: 9000, isVeg: true, categorySlug: 'bread-roti', calories: 250, prepTime: 5 },
      { name: 'Paratha', description: 'Layered flatbread', pricePaise: 12000, isVeg: true, categorySlug: 'bread-roti', calories: 300, prepTime: 8 },
      { name: 'Aloo Paratha', description: 'Paratha stuffed with potatoes', pricePaise: 15000, isVeg: true, categorySlug: 'bread-roti', calories: 400, prepTime: 12 },
      { name: 'Chapati', description: 'Thin whole wheat bread', pricePaise: 4000, isVeg: true, categorySlug: 'bread-roti', calories: 120, prepTime: 2 },
      { name: 'Kulcha', description: 'Soft bread with onions', pricePaise: 11000, isVeg: true, categorySlug: 'bread-roti', calories: 180, prepTime: 6 },
      { name: 'Tandoori Roti', description: 'Clay oven baked bread', pricePaise: 6000, isVeg: true, categorySlug: 'bread-roti', calories: 160, prepTime: 4 },
      { name: 'Missi Roti', description: 'Spiced gram flour bread', pricePaise: 8000, isVeg: true, categorySlug: 'bread-roti', calories: 200, prepTime: 6 },

      // Desserts
      { name: 'Gulab Jamun', description: 'Sweet milk dumplings in rose syrup', pricePaise: 12000, isVeg: true, categorySlug: 'desserts', calories: 300, prepTime: 10 },
      { name: 'Rasgulla', description: 'Soft cottage cheese balls in syrup', pricePaise: 10000, isVeg: true, categorySlug: 'desserts', calories: 250, prepTime: 8 },
      { name: 'Kheer', description: 'Rice pudding with nuts', pricePaise: 15000, isVeg: true, categorySlug: 'desserts', calories: 200, prepTime: 15 },
      { name: 'Chocolate Cake', description: 'Rich chocolate cake', pricePaise: 20000, isVeg: true, categorySlug: 'desserts', calories: 400, prepTime: 5 },
      { name: 'Tiramisu', description: 'Classic Italian dessert', pricePaise: 25000, isVeg: true, categorySlug: 'desserts', calories: 350, prepTime: 5 },
      { name: 'Cheesecake', description: 'Creamy cheesecake', pricePaise: 22000, isVeg: true, categorySlug: 'desserts', calories: 380, prepTime: 5 },
      { name: 'Brownie', description: 'Chocolate brownie with ice cream', pricePaise: 18000, isVeg: true, categorySlug: 'desserts', calories: 320, prepTime: 5 },
      { name: 'Halwa', description: 'Sweet semolina pudding', pricePaise: 14000, isVeg: true, categorySlug: 'desserts', calories: 280, prepTime: 12 },
      { name: 'Jalebi', description: 'Crispy sweet spirals', pricePaise: 8000, isVeg: true, categorySlug: 'desserts', calories: 200, prepTime: 8 },
      { name: 'Ladoo', description: 'Sweet round balls', pricePaise: 6000, isVeg: true, categorySlug: 'desserts', calories: 150, prepTime: 5 },

      // Ice Creams
      { name: 'Vanilla Ice Cream', description: 'Classic vanilla ice cream', pricePaise: 8000, isVeg: true, categorySlug: 'ice-creams', calories: 150, prepTime: 2 },
      { name: 'Chocolate Ice Cream', description: 'Rich chocolate ice cream', pricePaise: 10000, isVeg: true, categorySlug: 'ice-creams', calories: 180, prepTime: 2 },
      { name: 'Strawberry Ice Cream', description: 'Fresh strawberry ice cream', pricePaise: 12000, isVeg: true, categorySlug: 'ice-creams', calories: 160, prepTime: 2 },
      { name: 'Mango Ice Cream', description: 'Creamy mango ice cream', pricePaise: 14000, isVeg: true, categorySlug: 'ice-creams', calories: 170, prepTime: 2 },
      { name: 'Pista Ice Cream', description: 'Pistachio ice cream', pricePaise: 15000, isVeg: true, categorySlug: 'ice-creams', calories: 190, prepTime: 2 },
      { name: 'Kulfi', description: 'Traditional Indian ice cream', pricePaise: 12000, isVeg: true, categorySlug: 'ice-creams', calories: 200, prepTime: 2 },
      { name: 'Butterscotch Ice Cream', description: 'Creamy butterscotch ice cream', pricePaise: 13000, isVeg: true, categorySlug: 'ice-creams', calories: 185, prepTime: 2 },
      { name: 'Cookies & Cream', description: 'Ice cream with cookie pieces', pricePaise: 16000, isVeg: true, categorySlug: 'ice-creams', calories: 220, prepTime: 2 },
      { name: 'Mint Chocolate Chip', description: 'Mint ice cream with chocolate chips', pricePaise: 14000, isVeg: true, categorySlug: 'ice-creams', calories: 195, prepTime: 2 },
      { name: 'Rocky Road', description: 'Chocolate ice cream with nuts and marshmallows', pricePaise: 18000, isVeg: true, categorySlug: 'ice-creams', calories: 250, prepTime: 2 }
    ];

    const createdMenuItems = [];
    for (const itemData of menuItems) {
      const category = createdCategories.find(cat => cat.slug === itemData.categorySlug);
      if (category) {
        const { categorySlug, ...itemDataWithoutSlug } = itemData;
        const menuItem = await prisma.menuItem.create({
          data: {
            ...itemDataWithoutSlug,
            categoryId: category.id,
          },
        });
        createdMenuItems.push(menuItem);
        console.log(`✅ Menu item created: ${menuItem.name}`);
      }
    }

    // 4. Create Events (10+ events)
    console.log('🎉 Creating events...');
    const events = [
      {
        title: 'Live Music Night',
        description: 'Enjoy live music while dining',
        startAt: new Date('2024-12-15T19:00:00Z'),
        endAt: new Date('2024-12-15T23:00:00Z'),
        location: 'Main Dining Hall',
        maxCapacity: 50,
        pricePaise: 0
      },
      {
        title: 'Wine Tasting Evening',
        description: 'Premium wine tasting with expert sommelier',
        startAt: new Date('2024-12-20T18:30:00Z'),
        endAt: new Date('2024-12-20T21:30:00Z'),
        location: 'Private Dining Room',
        maxCapacity: 20,
        pricePaise: 500000
      },
      {
        title: 'Cooking Workshop',
        description: 'Learn to cook authentic Indian dishes',
        startAt: new Date('2024-12-22T10:00:00Z'),
        endAt: new Date('2024-12-22T14:00:00Z'),
        location: 'Kitchen Studio',
        maxCapacity: 15,
        pricePaise: 200000
      },
      {
        title: 'New Year Celebration',
        description: 'Special New Year dinner with live entertainment',
        startAt: new Date('2024-12-31T20:00:00Z'),
        endAt: new Date('2025-01-01T02:00:00Z'),
        location: 'Entire Restaurant',
        maxCapacity: 100,
        pricePaise: 1000000
      },
      {
        title: 'Valentine\'s Day Special',
        description: 'Romantic dinner for couples',
        startAt: new Date('2025-02-14T18:00:00Z'),
        endAt: new Date('2025-02-14T23:00:00Z'),
        location: 'Romantic Corner',
        maxCapacity: 30,
        pricePaise: 300000
      },
      {
        title: 'Family Sunday Brunch',
        description: 'Special brunch menu for families',
        startAt: new Date('2024-12-08T10:00:00Z'),
        endAt: new Date('2024-12-08T15:00:00Z'),
        location: 'Main Dining Area',
        maxCapacity: 80,
        pricePaise: 150000
      },
      {
        title: 'Corporate Lunch Meeting',
        description: 'Business lunch with presentation facilities',
        startAt: new Date('2024-12-12T12:00:00Z'),
        endAt: new Date('2024-12-12T15:00:00Z'),
        location: 'Conference Room',
        maxCapacity: 25,
        pricePaise: 200000
      },
      {
        title: 'Kids Birthday Party',
        description: 'Special birthday celebration for kids',
        startAt: new Date('2024-12-18T16:00:00Z'),
        endAt: new Date('2024-12-18T19:00:00Z'),
        location: 'Kids Zone',
        maxCapacity: 20,
        pricePaise: 100000
      },
      {
        title: 'Anniversary Dinner',
        description: 'Celebrate your special anniversary',
        startAt: new Date('2024-12-25T19:00:00Z'),
        endAt: new Date('2024-12-25T23:00:00Z'),
        location: 'Private Dining',
        maxCapacity: 12,
        pricePaise: 400000
      },
      {
        title: 'Festival Special',
        description: 'Traditional festival celebration',
        startAt: new Date('2024-12-30T18:00:00Z'),
        endAt: new Date('2024-12-30T22:00:00Z'),
        location: 'Main Hall',
        maxCapacity: 60,
        pricePaise: 250000
      },
      {
        title: 'Chef\'s Table Experience',
        description: 'Exclusive dining experience with the chef',
        startAt: new Date('2025-01-05T19:30:00Z'),
        endAt: new Date('2025-01-05T23:30:00Z'),
        location: 'Chef\'s Table',
        maxCapacity: 8,
        pricePaise: 800000
      },
      {
        title: 'Weekend Buffet',
        description: 'Extensive buffet with live counters',
        startAt: new Date('2024-12-14T12:00:00Z'),
        endAt: new Date('2024-12-14T16:00:00Z'),
        location: 'Buffet Hall',
        maxCapacity: 120,
        pricePaise: 180000
      }
    ];

    const createdEvents = [];
    for (const eventData of events) {
      const event = await prisma.event.create({
        data: eventData,
      });
      createdEvents.push(event);
      console.log(`✅ Event created: ${event.title}`);
    }

    // 5. Create Bookings (15+ bookings)
    console.log('📅 Creating bookings...');
    const bookings = [
      {
        name: 'Rajesh Kumar',
        phone: '+91-9876543210',
        email: 'rajesh@example.com',
        partySize: 4,
        date: new Date('2024-12-15T19:00:00Z'),
        notes: 'Anniversary dinner',
        eventId: createdEvents[0].id,
        status: 'CONFIRMED'
      },
      {
        name: 'Priya Sharma',
        phone: '+91-9876543211',
        email: 'priya@example.com',
        partySize: 2,
        date: new Date('2024-12-20T18:30:00Z'),
        notes: 'Wine tasting for two',
        eventId: createdEvents[1].id,
        status: 'CONFIRMED'
      },
      {
        name: 'Amit Patel',
        phone: '+91-9876543212',
        email: 'amit@example.com',
        partySize: 1,
        date: new Date('2024-12-22T10:00:00Z'),
        notes: 'Learning to cook',
        eventId: createdEvents[2].id,
        status: 'PENDING'
      },
      {
        name: 'Sneha Reddy',
        phone: '+91-9876543213',
        email: 'sneha@example.com',
        partySize: 6,
        date: new Date('2024-12-31T20:00:00Z'),
        notes: 'New Year celebration',
        eventId: createdEvents[3].id,
        status: 'CONFIRMED'
      },
      {
        name: 'Vikram Singh',
        phone: '+91-9876543214',
        email: 'vikram@example.com',
        partySize: 2,
        date: new Date('2025-02-14T18:00:00Z'),
        notes: 'Valentine\'s dinner',
        eventId: createdEvents[4].id,
        status: 'CONFIRMED'
      },
      {
        name: 'Anita Gupta',
        phone: '+91-9876543215',
        email: 'anita@example.com',
        partySize: 5,
        date: new Date('2024-12-08T10:00:00Z'),
        notes: 'Family brunch',
        eventId: createdEvents[5].id,
        status: 'CONFIRMED'
      },
      {
        name: 'Rohit Verma',
        phone: '+91-9876543216',
        email: 'rohit@example.com',
        partySize: 8,
        date: new Date('2024-12-12T12:00:00Z'),
        notes: 'Business meeting',
        eventId: createdEvents[6].id,
        status: 'CONFIRMED'
      },
      {
        name: 'Sunita Mehta',
        phone: '+91-9876543217',
        email: 'sunita@example.com',
        partySize: 15,
        date: new Date('2024-12-18T16:00:00Z'),
        notes: 'Birthday party for 8-year-old',
        eventId: createdEvents[7].id,
        status: 'CONFIRMED'
      },
      {
        name: 'Deepak Joshi',
        phone: '+91-9876543218',
        email: 'deepak@example.com',
        partySize: 2,
        date: new Date('2024-12-25T19:00:00Z'),
        notes: '25th anniversary',
        eventId: createdEvents[8].id,
        status: 'CONFIRMED'
      },
      {
        name: 'Kavita Nair',
        phone: '+91-9876543219',
        email: 'kavita@example.com',
        partySize: 10,
        date: new Date('2024-12-30T18:00:00Z'),
        notes: 'Festival celebration',
        eventId: createdEvents[9].id,
        status: 'PENDING'
      },
      {
        name: 'Arjun Malhotra',
        phone: '+91-9876543220',
        email: 'arjun@example.com',
        partySize: 4,
        date: new Date('2025-01-05T19:30:00Z'),
        notes: 'Chef\'s table experience',
        eventId: createdEvents[10].id,
        status: 'CONFIRMED'
      },
      {
        name: 'Meera Iyer',
        phone: '+91-9876543221',
        email: 'meera@example.com',
        partySize: 3,
        date: new Date('2024-12-14T12:00:00Z'),
        notes: 'Weekend buffet',
        eventId: createdEvents[11].id,
        status: 'CONFIRMED'
      },
      {
        name: 'Suresh Kumar',
        phone: '+91-9876543222',
        email: 'suresh@example.com',
        partySize: 2,
        date: new Date('2024-12-16T20:00:00Z'),
        notes: 'Regular dinner',
        status: 'CONFIRMED'
      },
      {
        name: 'Lakshmi Devi',
        phone: '+91-9876543223',
        email: 'lakshmi@example.com',
        partySize: 4,
        date: new Date('2024-12-19T19:30:00Z'),
        notes: 'Family dinner',
        status: 'PENDING'
      },
      {
        name: 'Ravi Shankar',
        phone: '+91-9876543224',
        email: 'ravi@example.com',
        partySize: 6,
        date: new Date('2024-12-21T18:00:00Z'),
        notes: 'Office party',
        status: 'CONFIRMED'
      }
    ];

    const createdBookings = [];
    for (const bookingData of bookings) {
      const booking = await prisma.booking.create({
        data: bookingData,
      });
      createdBookings.push(booking);
      console.log(`✅ Booking created: ${booking.name} - ${booking.partySize} people`);
    }

    // 6. Create Orders (20+ orders)
    console.log('🛒 Creating orders...');
    const orders = [
      {
        orderNumber: 'ORD-001',
        customerName: 'Rajesh Kumar',
        customerPhone: '+91-9876543210',
        customerEmail: 'rajesh@example.com',
        orderType: 'DINE_IN',
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        totalPaise: 45000,
        tableNumber: 'T-05',
        notes: 'Less spicy',
        items: [
          { menuItemId: '', quantity: 2, unitPaise: 18000 },
          { menuItemId: '', quantity: 1, unitPaise: 9000 }
        ]
      },
      {
        orderNumber: 'ORD-002',
        customerName: 'Priya Sharma',
        customerPhone: '+91-9876543211',
        customerEmail: 'priya@example.com',
        orderType: 'TAKEAWAY',
        status: 'READY',
        paymentStatus: 'PAID',
        totalPaise: 32000,
        notes: 'Extra sauce',
        items: [
          { menuItemId: '', quantity: 1, unitPaise: 32000 }
        ]
      },
      {
        orderNumber: 'ORD-003',
        customerName: 'Amit Patel',
        customerPhone: '+91-9876543212',
        customerEmail: 'amit@example.com',
        orderType: 'DELIVERY',
        status: 'PREPARING',
        paymentStatus: 'PENDING',
        totalPaise: 28000,
        notes: 'No onions',
        items: [
          { menuItemId: '', quantity: 1, unitPaise: 28000 }
        ]
      },
      {
        orderNumber: 'ORD-004',
        customerName: 'Sneha Reddy',
        customerPhone: '+91-9876543213',
        customerEmail: 'sneha@example.com',
        orderType: 'DINE_IN',
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        totalPaise: 65000,
        tableNumber: 'T-12',
        items: [
          { menuItemId: '', quantity: 2, unitPaise: 35000 },
          { menuItemId: '', quantity: 1, unitPaise: 15000 },
          { menuItemId: '', quantity: 1, unitPaise: 15000 }
        ]
      },
      {
        orderNumber: 'ORD-005',
        customerName: 'Vikram Singh',
        customerPhone: '+91-9876543214',
        customerEmail: 'vikram@example.com',
        orderType: 'TAKEAWAY',
        status: 'CANCELLED',
        paymentStatus: 'REFUNDED',
        totalPaise: 25000,
        items: [
          { menuItemId: '', quantity: 1, unitPaise: 25000 }
        ]
      },
      {
        orderNumber: 'ORD-006',
        customerName: 'Anita Gupta',
        customerPhone: '+91-9876543215',
        customerEmail: 'anita@example.com',
        orderType: 'DINE_IN',
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        totalPaise: 42000,
        tableNumber: 'T-08',
        items: [
          { menuItemId: '', quantity: 1, unitPaise: 30000 },
          { menuItemId: '', quantity: 1, unitPaise: 12000 }
        ]
      },
      {
        orderNumber: 'ORD-007',
        customerName: 'Rohit Verma',
        customerPhone: '+91-9876543216',
        customerEmail: 'rohit@example.com',
        orderType: 'DELIVERY',
        status: 'READY',
        paymentStatus: 'PAID',
        totalPaise: 38000,
        items: [
          { menuItemId: '', quantity: 1, unitPaise: 38000 }
        ]
      },
      {
        orderNumber: 'ORD-008',
        customerName: 'Sunita Mehta',
        customerPhone: '+91-9876543217',
        customerEmail: 'sunita@example.com',
        orderType: 'DINE_IN',
        status: 'PREPARING',
        paymentStatus: 'PENDING',
        totalPaise: 55000,
        tableNumber: 'T-15',
        items: [
          { menuItemId: '', quantity: 2, unitPaise: 25000 },
          { menuItemId: '', quantity: 1, unitPaise: 5000 }
        ]
      },
      {
        orderNumber: 'ORD-009',
        customerName: 'Deepak Joshi',
        customerPhone: '+91-9876543218',
        customerEmail: 'deepak@example.com',
        orderType: 'DINE_IN',
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        totalPaise: 72000,
        tableNumber: 'T-03',
        items: [
          { menuItemId: '', quantity: 1, unitPaise: 35000 },
          { menuItemId: '', quantity: 1, unitPaise: 25000 },
          { menuItemId: '', quantity: 1, unitPaise: 12000 }
        ]
      },
      {
        orderNumber: 'ORD-010',
        customerName: 'Kavita Nair',
        customerPhone: '+91-9876543219',
        customerEmail: 'kavita@example.com',
        orderType: 'TAKEAWAY',
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        totalPaise: 29000,
        items: [
          { menuItemId: '', quantity: 1, unitPaise: 28000 },
          { menuItemId: '', quantity: 1, unitPaise: 1000 }
        ]
      },
      {
        orderNumber: 'ORD-011',
        customerName: 'Arjun Malhotra',
        customerPhone: '+91-9876543220',
        customerEmail: 'arjun@example.com',
        orderType: 'DELIVERY',
        status: 'PENDING',
        paymentStatus: 'PENDING',
        totalPaise: 33000,
        items: [
          { menuItemId: '', quantity: 1, unitPaise: 32000 },
          { menuItemId: '', quantity: 1, unitPaise: 1000 }
        ]
      },
      {
        orderNumber: 'ORD-012',
        customerName: 'Meera Iyer',
        customerPhone: '+91-9876543221',
        customerEmail: 'meera@example.com',
        orderType: 'DINE_IN',
        status: 'READY',
        paymentStatus: 'PAID',
        totalPaise: 48000,
        tableNumber: 'T-07',
        items: [
          { menuItemId: '', quantity: 1, unitPaise: 30000 },
          { menuItemId: '', quantity: 1, unitPaise: 18000 }
        ]
      },
      {
        orderNumber: 'ORD-013',
        customerName: 'Suresh Kumar',
        customerPhone: '+91-9876543222',
        customerEmail: 'suresh@example.com',
        orderType: 'TAKEAWAY',
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        totalPaise: 22000,
        items: [
          { menuItemId: '', quantity: 1, unitPaise: 22000 }
        ]
      },
      {
        orderNumber: 'ORD-014',
        customerName: 'Lakshmi Devi',
        customerPhone: '+91-9876543223',
        customerEmail: 'lakshmi@example.com',
        orderType: 'DINE_IN',
        status: 'PREPARING',
        paymentStatus: 'PENDING',
        totalPaise: 41000,
        tableNumber: 'T-11',
        items: [
          { menuItemId: '', quantity: 1, unitPaise: 28000 },
          { menuItemId: '', quantity: 1, unitPaise: 13000 }
        ]
      },
      {
        orderNumber: 'ORD-015',
        customerName: 'Ravi Shankar',
        customerPhone: '+91-9876543224',
        customerEmail: 'ravi@example.com',
        orderType: 'DELIVERY',
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        totalPaise: 36000,
        items: [
          { menuItemId: '', quantity: 1, unitPaise: 32000 },
          { menuItemId: '', quantity: 1, unitPaise: 4000 }
        ]
      },
      {
        orderNumber: 'ORD-016',
        customerName: 'Pooja Agarwal',
        customerPhone: '+91-9876543225',
        customerEmail: 'pooja@example.com',
        orderType: 'DINE_IN',
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        totalPaise: 52000,
        tableNumber: 'T-09',
        items: [
          { menuItemId: '', quantity: 1, unitPaise: 35000 },
          { menuItemId: '', quantity: 1, unitPaise: 17000 }
        ]
      },
      {
        orderNumber: 'ORD-017',
        customerName: 'Manish Tiwari',
        customerPhone: '+91-9876543226',
        customerEmail: 'manish@example.com',
        orderType: 'TAKEAWAY',
        status: 'READY',
        paymentStatus: 'PAID',
        totalPaise: 27000,
        items: [
          { menuItemId: '', quantity: 1, unitPaise: 25000 },
          { menuItemId: '', quantity: 1, unitPaise: 2000 }
        ]
      },
      {
        orderNumber: 'ORD-018',
        customerName: 'Neha Singh',
        customerPhone: '+91-9876543227',
        customerEmail: 'neha@example.com',
        orderType: 'DELIVERY',
        status: 'PREPARING',
        paymentStatus: 'PENDING',
        totalPaise: 31000,
        items: [
          { menuItemId: '', quantity: 1, unitPaise: 30000 },
          { menuItemId: '', quantity: 1, unitPaise: 1000 }
        ]
      },
      {
        orderNumber: 'ORD-019',
        customerName: 'Kiran Desai',
        customerPhone: '+91-9876543228',
        customerEmail: 'kiran@example.com',
        orderType: 'DINE_IN',
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        totalPaise: 44000,
        tableNumber: 'T-14',
        items: [
          { menuItemId: '', quantity: 1, unitPaise: 28000 },
          { menuItemId: '', quantity: 1, unitPaise: 16000 }
        ]
      },
      {
        orderNumber: 'ORD-020',
        customerName: 'Rajesh Kumar',
        customerPhone: '+91-9876543210',
        customerEmail: 'rajesh@example.com',
        orderType: 'TAKEAWAY',
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        totalPaise: 35000,
        items: [
          { menuItemId: '', quantity: 1, unitPaise: 35000 }
        ]
      }
    ];

    const createdOrders = [];
    for (const orderData of orders) {
      const { items, ...orderDataWithoutItems } = orderData;
      const order = await prisma.order.create({
        data: orderDataWithoutItems,
      });

      // Add order items
      for (const item of items) {
        const randomMenuItem = createdMenuItems[Math.floor(Math.random() * createdMenuItems.length)];
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            menuItemId: randomMenuItem.id,
            quantity: item.quantity,
            unitPaise: randomMenuItem.pricePaise,
          },
        });
      }

      createdOrders.push(order);
      console.log(`✅ Order created: ${order.orderNumber} - ₹${order.totalPaise / 100}`);
    }

    // 7. Create Media (10+ media files)
    console.log('📸 Creating media...');
    const mediaFiles = [
      {
        url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b',
        filename: 'restaurant-interior.jpg',
        mimeType: 'image/jpeg',
        size: 2048000,
        caption: 'Beautiful restaurant interior',
        type: 'IMAGE'
      },
      {
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
        filename: 'food-presentation.jpg',
        mimeType: 'image/jpeg',
        size: 1536000,
        caption: 'Elegant food presentation',
        type: 'IMAGE'
      },
      {
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        filename: 'chef-cooking.jpg',
        mimeType: 'image/jpeg',
        size: 1792000,
        caption: 'Chef preparing delicious food',
        type: 'IMAGE'
      },
      {
        url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add',
        filename: 'burger-dish.jpg',
        mimeType: 'image/jpeg',
        size: 1280000,
        caption: 'Delicious burger',
        type: 'IMAGE'
      },
      {
        url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187',
        filename: 'pizza-dish.jpg',
        mimeType: 'image/jpeg',
        size: 1920000,
        caption: 'Fresh pizza',
        type: 'IMAGE'
      },
      {
        url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
        filename: 'pasta-dish.jpg',
        mimeType: 'image/jpeg',
        size: 1664000,
        caption: 'Creamy pasta',
        type: 'IMAGE'
      },
      {
        url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
        filename: 'pancakes.jpg',
        mimeType: 'image/jpeg',
        size: 1408000,
        caption: 'Fluffy pancakes',
        type: 'IMAGE'
      },
      {
        url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307',
        filename: 'dessert.jpg',
        mimeType: 'image/jpeg',
        size: 1152000,
        caption: 'Sweet dessert',
        type: 'IMAGE'
      },
      {
        url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330',
        filename: 'salad.jpg',
        mimeType: 'image/jpeg',
        size: 1024000,
        caption: 'Fresh salad',
        type: 'IMAGE'
      },
      {
        url: 'https://images.unsplash.com/photo-1574484284002-952d92456975',
        filename: 'drinks.jpg',
        mimeType: 'image/jpeg',
        size: 896000,
        caption: 'Refreshing drinks',
        type: 'IMAGE'
      },
      {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
        filename: 'restaurant-exterior.jpg',
        mimeType: 'image/jpeg',
        size: 2304000,
        caption: 'Restaurant exterior view',
        type: 'IMAGE'
      },
      {
        url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2',
        filename: 'kitchen.jpg',
        mimeType: 'image/jpeg',
        size: 2048000,
        caption: 'Professional kitchen',
        type: 'IMAGE'
      }
    ];

    const createdMedia = [];
    for (const mediaData of mediaFiles) {
      const media = await prisma.media.create({
        data: mediaData,
      });
      createdMedia.push(media);
      console.log(`✅ Media created: ${media.filename}`);
    }

    // 8. Create System Settings (10+ settings)
    console.log('⚙️ Creating system settings...');
    const systemSettings = [
      {
        key: 'restaurant_name',
        value: 'Rapchai Restaurant',
        type: 'STRING',
        description: 'Name of the restaurant'
      },
      {
        key: 'restaurant_address',
        value: '123 Main Street, City Center, Mumbai - 400001',
        type: 'STRING',
        description: 'Restaurant address'
      },
      {
        key: 'restaurant_phone',
        value: '+91-9876543210',
        type: 'STRING',
        description: 'Restaurant contact number'
      },
      {
        key: 'restaurant_email',
        value: 'info@rapchai.com',
        type: 'STRING',
        description: 'Restaurant email address'
      },
      {
        key: 'opening_hours',
        value: '{"monday":"10:00-22:00","tuesday":"10:00-22:00","wednesday":"10:00-22:00","thursday":"10:00-22:00","friday":"10:00-23:00","saturday":"10:00-23:00","sunday":"10:00-22:00"}',
        type: 'JSON',
        description: 'Restaurant opening hours'
      },
      {
        key: 'delivery_radius',
        value: '10',
        type: 'NUMBER',
        description: 'Delivery radius in kilometers'
      },
      {
        key: 'min_order_amount',
        value: '200',
        type: 'NUMBER',
        description: 'Minimum order amount in rupees'
      },
      {
        key: 'delivery_fee',
        value: '50',
        type: 'NUMBER',
        description: 'Delivery fee in rupees'
      },
      {
        key: 'tax_rate',
        value: '18',
        type: 'NUMBER',
        description: 'Tax rate percentage'
      },
      {
        key: 'enable_online_ordering',
        value: 'true',
        type: 'BOOLEAN',
        description: 'Enable online ordering system'
      },
      {
        key: 'enable_delivery',
        value: 'true',
        type: 'BOOLEAN',
        description: 'Enable delivery service'
      },
      {
        key: 'enable_takeaway',
        value: 'true',
        type: 'BOOLEAN',
        description: 'Enable takeaway service'
      },
      {
        key: 'max_table_capacity',
        value: '8',
        type: 'NUMBER',
        description: 'Maximum table capacity'
      },
      {
        key: 'booking_advance_days',
        value: '30',
        type: 'NUMBER',
        description: 'Maximum days in advance for booking'
      },
      {
        key: 'auto_confirm_orders',
        value: 'false',
        type: 'BOOLEAN',
        description: 'Automatically confirm orders'
      }
    ];

    const createdSettings = [];
    for (const settingData of systemSettings) {
      const setting = await prisma.systemSettings.upsert({
        where: { key: settingData.key },
        update: settingData,
        create: settingData,
      });
      createdSettings.push(setting);
      console.log(`✅ System setting created: ${setting.key}`);
    }

    console.log('\n🎉 Comprehensive database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   📂 Categories: ${createdCategories.length}`);
    console.log(`   🍽️ Menu Items: ${createdMenuItems.length}`);
    console.log(`   🎉 Events: ${createdEvents.length}`);
    console.log(`   📅 Bookings: ${createdBookings.length}`);
    console.log(`   🛒 Orders: ${createdOrders.length}`);
    console.log(`   📸 Media: ${createdMedia.length}`);
    console.log(`   ⚙️ Settings: ${createdSettings.length}`);
    console.log('\n🚀 Your Supabase database is now fully populated and ready for use!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
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
