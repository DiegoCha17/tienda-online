export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
};