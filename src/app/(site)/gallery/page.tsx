export const metadata = {
  title: "Gallery",
  description: "Moments from Rapchai Café — food, friends, and live music.",
};

const PHOTOS = [
  { id: 1, caption: "Filter Coffee Moments" },
  { id: 2, caption: "Mini Burger Magic" },
  { id: 3, caption: "Rap Night Live" },
  { id: 4, caption: "Cozy Corners" },
  { id: 5, caption: "Fresh Salads" },
  { id: 6, caption: "Community Vibes" },
];

export default function GalleryPage() {
  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold">Gallery</h1>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PHOTOS.map((p) => (
          <figure key={p.id} className="group relative overflow-hidden rounded-xl bg-white ring-1 ring-black/5">
            <div className="aspect-square bg-center bg-cover" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200&auto=format&fit=crop)` }} />
            <figcaption className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition">{p.caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}


