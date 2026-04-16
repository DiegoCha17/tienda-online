export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string; // Keep for backward compatibility/thumbnail
  images?: string[]; // New: gallery array
  specifications?: Record<string, string[]>; // New: { color: ["Red", "Blue"], size: ["S", "M"] }
  stock: number;
  category?: string;
  active?: boolean;
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  selected_specifications?: Record<string, string>; // New: { color: "Red", size: "M" }
};