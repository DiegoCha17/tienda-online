// ============================================
// Tipos centralizados para toda la aplicación
// ============================================

/** Producto tal como viene de la base de datos */
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  images?: string[] | null;
  specifications?: Record<string, string[]> | null;
  features?: Record<string, string> | null;
  stock: number;
  category?: string;
  active?: boolean;
};

/** Artículo dentro del carrito de compras */
export type CartItem = {
  id: number;
  cartItemId: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  selectedSpecs?: Record<string, string>;
};

/** Categoría de producto */
export type Category = {
  id: number;
  name: string;
};

/** Datos del cliente al hacer checkout */
export type Customer = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

/** Artículo dentro de una orden */
export type OrderItem = {
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
};

/** Pedido completo */
export type Order = {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
};

/** Especificación con nombre y valores (para formularios admin) */
export type Spec = {
  name: string;
  values: string[];
};