// Direct Supabase Data Push Script
const { PrismaClient } = require('./src/generated/prisma/client');

const prisma = new PrismaClient();

async function pushRapchaiDataToSupabase() {
  console.log('🍽️ PUSHING RAPCHAI MENU TO SUPABASE...');
  
  try {
    // Create Rapchai Categories
    console.log('📂 Creating Rapchai Categories...');
    
    const categories = [
      {
        name: 'Chais & Signature Coffees',
        slug: 'chais-coffees',
        description: 'Traditional Assam chai and signature coffees brewed with our special filter'
      },
      {
        name: 'Mini Burgers',
        slug: 'mini-burgers', 
        description: 'Perfect bite-sized sliders in veg and non-veg options'
      },
      {
        name: 'Sandwiches',
        slug: 'sandwiches',
        description: 'Delicious sandwiches on our 4-inch sub bread'
      },
      {
        name: 'Rolls & Soups',
        slug: 'rolls-soups',
        description: 'Juicy rolls and perfect soups for cold days'
      },
      {
        name: 'Our Specials',
        slug: 'our-specials',
        description: 'Chef special creations that have become staples'
      },
      {
        name: 'Our Squares',
        slug: 'our-squares',
        description: 'Homemade biscuits - spicy, buttery, and fruity'
      }
    ];

    const createdCategories = [];
    for (const category of categories) {
      try {
        const result = await prisma.category.upsert({
          where: { slug: category.slug },
          update: category,
          create: category
        });
        createdCategories.push(result);
        console.log(`✅ Category: ${category.name}`);
      } catch (error) {
        console.log(`⚠️ Category ${category.name} might already exist`);
      }
    }

    // Add Rapchai Menu Items
    console.log('\n🍽️ Adding Rapchai Menu Items...');
    
    const menuItems = [
      // Chais & Signature Coffees
      { name: 'Traditional Assam Chai', description: 'Brewed from Assam leaves using our traditional filter for perfect decoction', pricePaise: 8000, isVeg: true, categorySlug: 'chais-coffees' },
      { name: 'Masala Chai', description: 'Spiced chai with aromatic spices', pricePaise: 9000, isVeg: true, categorySlug: 'chais-coffees' },
      { name: 'Ginger Chai', description: 'Warming ginger chai for cold days', pricePaise: 9000, isVeg: true, categorySlug: 'chais-coffees' },
      { name: 'Cardamom Chai', description: 'Fragrant cardamom-infused chai', pricePaise: 10000, isVeg: true, categorySlug: 'chais-coffees' },
      { name: 'Cold Chai', description: 'Refreshing iced chai perfect for warm days', pricePaise: 10000, isVeg: true, categorySlug: 'chais-coffees' },
      { name: 'Signature Coffee', description: 'Our special coffee blend brewed with traditional filter', pricePaise: 12000, isVeg: true, categorySlug: 'chais-coffees' },
      { name: 'Cappuccino', description: 'Rich espresso with steamed milk foam', pricePaise: 15000, isVeg: true, categorySlug: 'chais-coffees' },
      { name: 'Latte', description: 'Smooth coffee with steamed milk', pricePaise: 14000, isVeg: true, categorySlug: 'chais-coffees' },
      { name: 'Americano', description: 'Strong black coffee', pricePaise: 10000, isVeg: true, categorySlug: 'chais-coffees' },
      { name: 'Cold Coffee', description: 'Iced coffee with milk', pricePaise: 13000, isVeg: true, categorySlug: 'chais-coffees' },
      
      // Mini Burgers
      { name: 'Veg Mini Burger', description: 'Perfect bite-sized veg slider with fresh vegetables', pricePaise: 12000, isVeg: true, categorySlug: 'mini-burgers' },
      { name: 'Chicken Mini Burger', description: 'Juicy chicken patty in a mini bun', pricePaise: 15000, isVeg: false, categorySlug: 'mini-burgers' },
      { name: 'Beef Mini Burger', description: 'Tender beef patty slider', pricePaise: 18000, isVeg: false, categorySlug: 'mini-burgers' },
      { name: 'Paneer Mini Burger', description: 'Cottage cheese patty with spices', pricePaise: 14000, isVeg: true, categorySlug: 'mini-burgers' },
      { name: 'Fish Mini Burger', description: 'Crispy fish patty slider', pricePaise: 16000, isVeg: false, categorySlug: 'mini-burgers' },
      { name: 'Mushroom Mini Burger', description: 'Grilled mushroom patty slider', pricePaise: 13000, isVeg: true, categorySlug: 'mini-burgers' },
      
      // Sandwiches
      { name: 'Veg Sandwich', description: 'Fresh vegetables on our 4-inch sub bread', pricePaise: 10000, isVeg: true, categorySlug: 'sandwiches' },
      { name: 'Chicken Sandwich', description: 'Grilled chicken on 4-inch sub bread', pricePaise: 14000, isVeg: false, categorySlug: 'sandwiches' },
      { name: 'Beef Sandwich', description: 'Tender beef on 4-inch sub bread', pricePaise: 16000, isVeg: false, categorySlug: 'sandwiches' },
      { name: 'Paneer Sandwich', description: 'Cottage cheese with vegetables', pricePaise: 12000, isVeg: true, categorySlug: 'sandwiches' },
      { name: 'Egg Sandwich', description: 'Scrambled eggs with vegetables', pricePaise: 11000, isVeg: false, categorySlug: 'sandwiches' },
      { name: 'Grilled Cheese Sandwich', description: 'Melted cheese on toasted bread', pricePaise: 10000, isVeg: true, categorySlug: 'sandwiches' },
      
      // Rolls & Soups
      { name: 'Chicken Roll', description: 'Juicy chicken wrapped in soft bread', pricePaise: 12000, isVeg: false, categorySlug: 'rolls-soups' },
      { name: 'Egg Roll', description: 'Scrambled eggs wrapped in soft bread', pricePaise: 10000, isVeg: false, categorySlug: 'rolls-soups' },
      { name: 'Veg Roll', description: 'Fresh vegetables wrapped in soft bread', pricePaise: 9000, isVeg: true, categorySlug: 'rolls-soups' },
      { name: 'Paneer Roll', description: 'Cottage cheese wrapped in soft bread', pricePaise: 11000, isVeg: true, categorySlug: 'rolls-soups' },
      { name: 'Tomato Soup', description: 'Perfect soup for cold days', pricePaise: 8000, isVeg: true, categorySlug: 'rolls-soups' },
      { name: 'Chicken Soup', description: 'Hearty chicken soup', pricePaise: 10000, isVeg: false, categorySlug: 'rolls-soups' },
      { name: 'Vegetable Soup', description: 'Fresh vegetable soup', pricePaise: 8000, isVeg: true, categorySlug: 'rolls-soups' },
      { name: 'Corn Soup', description: 'Sweet corn soup', pricePaise: 9000, isVeg: true, categorySlug: 'rolls-soups' },
      
      // Our Specials
      { name: 'Chef Special Pasta', description: 'Our signature pasta creation', pricePaise: 18000, isVeg: true, categorySlug: 'our-specials' },
      { name: 'Special Chicken Curry', description: 'Chef special chicken curry', pricePaise: 20000, isVeg: false, categorySlug: 'our-specials' },
      { name: 'Rapchai Special Rice', description: 'Our unique rice preparation', pricePaise: 16000, isVeg: true, categorySlug: 'our-specials' },
      { name: 'Special Veggie Bowl', description: 'Healthy vegetable bowl', pricePaise: 15000, isVeg: true, categorySlug: 'our-specials' },
      { name: 'Chef Special Wrap', description: 'Our signature wrap creation', pricePaise: 14000, isVeg: true, categorySlug: 'our-specials' },
      { name: 'Special Fish Fry', description: 'Chef special fish preparation', pricePaise: 22000, isVeg: false, categorySlug: 'our-specials' },
      
      // Our Squares
      { name: 'Spicy Squares', description: 'Homemade spicy biscuits', pricePaise: 3000, isVeg: true, categorySlug: 'our-squares' },
      { name: 'Buttery Squares', description: 'Rich buttery homemade biscuits', pricePaise: 3000, isVeg: true, categorySlug: 'our-squares' },
      { name: 'Fruity Squares', description: 'Sweet fruity homemade biscuits', pricePaise: 3000, isVeg: true, categorySlug: 'our-squares' },
      { name: 'Chocolate Squares', description: 'Chocolate-flavored homemade biscuits', pricePaise: 3500, isVeg: true, categorySlug: 'our-squares' },
      { name: 'Mixed Squares', description: 'Assorted homemade biscuits', pricePaise: 4000, isVeg: true, categorySlug: 'our-squares' }
    ];

    let successCount = 0;
    let errorCount = 0;

    for (const item of menuItems) {
      try {
        // Find category by slug
        const category = await prisma.category.findUnique({
          where: { slug: item.categorySlug }
        });

        if (!category) {
          console.log(`❌ Category not found: ${item.categorySlug}`);
          errorCount++;
          continue;
        }

        // Create menu item
        await prisma.menuItem.upsert({
          where: { 
            name_categoryId: {
              name: item.name,
              categoryId: category.id
            }
          },
          update: {
            description: item.description,
            pricePaise: item.pricePaise,
            isVeg: item.isVeg
          },
          create: {
            name: item.name,
            description: item.description,
            pricePaise: item.pricePaise,
            isVeg: item.isVeg,
            categoryId: category.id
          }
        });

        successCount++;
        console.log(`✅ ${item.name} - ₹${item.pricePaise/100}`);
      } catch (error) {
        errorCount++;
        console.log(`❌ Failed: ${item.name} - ${error.message}`);
      }
    }

    console.log('\n🎉 RAPCHAI MENU PUSH TO SUPABASE COMPLETE!');
    console.log('📊 Results:');
    console.log(`   ✅ Successfully added: ${successCount} items`);
    console.log(`   ❌ Failed: ${errorCount} items`);

    // Verify final count
    const totalItems = await prisma.menuItem.count();
    console.log(`\n📈 Total menu items in Supabase: ${totalItems}`);
    console.log('🚀 Your affordable vibrant cafe menu is now in Supabase!');
    console.log('✨ Perfect for rap music events and healthy continental dining!');

  } catch (error) {
    console.error('❌ Error pushing data to Supabase:', error);
  } finally {
    await prisma.$disconnect();
  }
}

pushRapchaiDataToSupabase();
