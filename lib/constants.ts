// ============================================
// Constantes globales de la aplicación
// ============================================

/** Nombre de la tienda (usado en header, footer, metadata) */
export const STORE_NAME = "Mi Tienda";

/** Descripción corta de la tienda */
export const STORE_DESCRIPTION = "Tienda virtual con los mejores productos al mejor precio.";

/** Número de WhatsApp para pedidos (sin código de país) */
export const WHATSAPP_NUMBER = "70939586";

/** Categoría por defecto cuando un producto no tiene una asignada */
export const DEFAULT_CATEGORY = "General";

/** Umbral de stock bajo para mostrar badge de alerta */
export const LOW_STOCK_THRESHOLD = 5;

/** Cantidad de productos visibles por "página" en el catálogo */
export const PRODUCTS_PER_PAGE = 24;

/** Clave de localStorage para el carrito */
export const CART_STORAGE_KEY = "cart";

/** Nombre del evento custom para sincronizar el carrito entre componentes */
export const CART_UPDATED_EVENT = "cart-updated";
