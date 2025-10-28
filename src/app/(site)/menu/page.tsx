import MenuClient from "./MenuClient";

type MenuItem = { id: number; title: string; veg: boolean; price: number; category: string };

const ITEMS: MenuItem[] = [
  { id: 1, title: "Masala Chai", veg: true, price: 79, category: "Chai/Coffee" },
  { id: 2, title: "Filter Coffee", veg: true, price: 89, category: "Chai/Coffee" },
  { id: 3, title: "Cold Coffee", veg: true, price: 99, category: "Chai/Coffee" },
  { id: 4, title: "Mini Burger – Classic", veg: true, price: 149, category: "Mini Burgers" },
  { id: 5, title: "Mini Burger – Chicken", veg: false, price: 169, category: "Mini Burgers" },
  { id: 6, title: "Mini Burger – Beef", veg: false, price: 179, category: "Mini Burgers" },
  { id: 7, title: "Paneer Sandwich", veg: true, price: 189, category: "Sandwiches" },
  { id: 8, title: "Chicken Sandwich", veg: false, price: 199, category: "Sandwiches" },
  { id: 9, title: "Beef Sandwich", veg: false, price: 209, category: "Sandwiches" },
  { id: 10, title: "Paneer Kathi Roll", veg: true, price: 199, category: "Rolls" },
  { id: 11, title: "Chicken Kathi Roll", veg: false, price: 219, category: "Rolls" },
  { id: 12, title: "Tomato Soup", veg: true, price: 149, category: "Soups" },
  { id: 13, title: "Chicken Soup", veg: false, price: 169, category: "Soups" },
  { id: 14, title: "Rapchai Special", veg: true, price: 229, category: "Specials" },
  { id: 15, title: "Chef's Special", veg: false, price: 249, category: "Specials" },
  { id: 16, title: "Caesar Salad", veg: true, price: 219, category: "Salads" },
  { id: 17, title: "Chicken Salad", veg: false, price: 239, category: "Salads" },
  { id: 18, title: "Grilled Steak", veg: false, price: 399, category: "Steaks" },
  { id: 19, title: "Chocolate Square", veg: true, price: 99, category: "Squares" },
  { id: 20, title: "Butter Square", veg: true, price: 89, category: "Squares" },
];

const CATEGORIES = ["Chai/Coffee","Mini Burgers","Sandwiches","Rolls","Soups","Specials","Squares","Salads","Steaks"] as const;

export const metadata = {
  title: "Menu",
  description: "Our affordable vibrant cafe offers a healthy continental menu inspired by the best styles of cooking.",
};

export default function MenuPage() {
  return (
    <div className="py-12 bg-[var(--rc-creamy-beige)] min-h-screen">
      <div className="w-[95%] mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold text-[var(--rc-espresso-brown)]">Menu</h1>
        </div>
        <p className="text-lg text-[var(--rc-text-secondary)] max-w-4xl font-medium mb-8 whitespace-nowrap">From our mini burgers and sandwiches to our specials, everything is freshly crafted with wholesome ingredients right in front of you.</p>
        <MenuClient items={ITEMS} categories={[...CATEGORIES]} />
      </div>
    </div>
  );
}


