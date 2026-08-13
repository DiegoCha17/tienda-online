import { NextResponse } from "next/server";
import { resend } from "@/lib/mail";
import { sql } from "@/lib/db";
import { formatCRC } from "@/lib/currency";
import type { CartItem, Customer } from "@/lib/types";

const rateLimit = new Map<string, { count: number; timestamp: number }>();
const MAX_CART_QUANTITY = 100;

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isCustomer(value: unknown): value is Customer {
  if (!value || typeof value !== "object") return false;
  const customer = value as Partial<Customer>;
  return (
    typeof customer.name === "string" && customer.name.trim().length >= 2 &&
    customer.name.length <= 120 &&
    typeof customer.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) &&
    customer.email.length <= 254 &&
    (customer.phone === undefined || typeof customer.phone === "string") &&
    (customer.address === undefined || typeof customer.address === "string")
  );
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CartItem>;
  return (
    Number.isSafeInteger(item.id) && Number(item.id) > 0 &&
    typeof item.name === "string" &&
    Number.isSafeInteger(item.quantity) &&
    Number(item.quantity) >= 1 && Number(item.quantity) <= MAX_CART_QUANTITY &&
    (item.selectedSpecs === undefined ||
      (typeof item.selectedSpecs === "object" && item.selectedSpecs !== null))
  );
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const now = Date.now();
    const limitInfo = rateLimit.get(ip);
    if (limitInfo && now - limitInfo.timestamp < 60_000) {
      if (limitInfo.count >= 5) {
        return NextResponse.json(
          { error: "Demasiados intentos. Espera 1 minuto." },
          { status: 429 },
        );
      }
      limitInfo.count += 1;
    } else {
      rateLimit.set(ip, { count: 1, timestamp: now });
    }

    const body = await req.json();
    if (!isCustomer(body?.customer) || !Array.isArray(body?.cart) || body.cart.length === 0 || body.cart.length > 50) {
      return NextResponse.json({ error: "Datos de checkout inválidos" }, { status: 400 });
    }

    const cart = body.cart as unknown[];
    if (!cart.every(isCartItem)) {
      return NextResponse.json({ error: "El carrito contiene cantidades inválidas" }, { status: 400 });
    }
    if (new Set(cart.map((item) => item.id)).size !== cart.length) {
      return NextResponse.json({ error: "El carrito contiene productos repetidos" }, { status: 400 });
    }

    const customer = body.customer as Customer;
    const requestedByProduct = new Map<number, number>();
    for (const item of cart) {
      requestedByProduct.set(item.id, (requestedByProduct.get(item.id) || 0) + item.quantity);
    }
    const requestedItems = Array.from(requestedByProduct, ([id, quantity]) => ({ id, quantity }));

    // The database supplies names and prices. The client only supplies IDs and quantities.
    const products = await sql`
      SELECT id, name, price, stock, active, image_url
      FROM products
      WHERE id = ANY(${requestedItems.map((item) => item.id)})
    `;
    const productById = new Map(products.map((product) => [Number(product.id), product]));
    const validatedCart = [];
    let calculatedTotal = 0;

    for (const item of cart) {
      const product = productById.get(item.id);
      if (!product) {
        return NextResponse.json({ error: "Uno de los productos ya no existe." }, { status: 400 });
      }
      if (!product.active) {
        return NextResponse.json({ error: `El producto ${product.name} no está disponible.` }, { status: 400 });
      }
      const requestedQuantity = requestedByProduct.get(item.id) || item.quantity;
      if (Number(product.stock) < requestedQuantity) {
        return NextResponse.json(
          { error: `No hay suficiente stock para ${product.name}. Disponible: ${product.stock}` },
          { status: 400 },
        );
      }

      const dbPrice = Number(product.price);
      calculatedTotal += dbPrice * item.quantity;
      validatedCart.push({
        id: item.id,
        name: String(product.name),
        price: dbPrice,
        image_url: product.image_url || "",
        quantity: item.quantity,
        selectedSpecs: item.selectedSpecs || {},
      });
    }

    const transactionRows = await sql.transaction([
      sql`
        WITH requested AS (
          SELECT * FROM jsonb_to_recordset(${JSON.stringify(requestedItems)}::jsonb)
            AS item(id integer, quantity integer)
        ), available AS (
          SELECT COUNT(*)::integer AS matching
          FROM requested r
          JOIN products p ON p.id = r.id
          WHERE p.active = TRUE AND p.stock >= r.quantity
        ), new_order AS (
          INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, total)
          SELECT ${customer.name.trim()}, ${customer.email.trim()}, ${customer.phone?.trim() || ""},
            ${customer.address?.trim() || ""}, ${calculatedTotal}
          FROM available
          WHERE available.matching = ${requestedItems.length}
          RETURNING id
        ), inserted_items AS (
          INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, subtotal)
          SELECT o.id, r.id, p.name, p.price, r.quantity, p.price * r.quantity
          FROM new_order o
          CROSS JOIN requested r
          JOIN products p ON p.id = r.id
          RETURNING order_id
        ), updated_stock AS (
          UPDATE products p
          SET stock = p.stock - r.quantity
          FROM requested r, new_order o
          WHERE p.id = r.id AND p.stock >= r.quantity
          RETURNING p.id
        ), consistency_check AS (
          SELECT CASE
            WHEN (SELECT COUNT(*) FROM updated_stock) = ${requestedItems.length}
            THEN 1
            ELSE (1 / 0)
          END AS valid
        )
        SELECT (SELECT id FROM new_order LIMIT 1) AS order_id,
          (SELECT COUNT(*) FROM updated_stock)::integer AS updated_count,
          (SELECT valid FROM consistency_check) AS valid
      `,
    ]);

    const transactionResult = transactionRows[0]?.[0] as { order_id?: number; updated_count?: number } | undefined;
    if (!transactionResult?.order_id || Number(transactionResult.updated_count) !== requestedItems.length) {
      return NextResponse.json(
        { error: "El inventario cambió. Revisa las cantidades e inténtalo de nuevo." },
        { status: 409 },
      );
    }

    const orderId = Number(transactionResult.order_id);
    const itemsHtml = validatedCart.map((item) => {
      const specsText = Object.entries(item.selectedSpecs)
        .map(([key, value]) => `<b>${escapeHtml(key)}:</b> ${escapeHtml(value)}`)
        .join(" | ");
      const specsHtml = specsText
        ? `<br /><span style="color: #666; font-size: 0.9em;">Especificaciones: ${specsText}</span>`
        : "";
      return `<li style="display: flex; align-items: center; margin-bottom: 10px;">
        <img src="${escapeHtml(item.image_url || "https://via.placeholder.com/80")}" alt="${escapeHtml(item.name)}" width="60" height="60" style="border-radius: 8px; object-fit: cover; margin-right: 15px; border: 1px solid #ddd;" />
        <div><strong>${escapeHtml(item.name)}</strong><br />
        <span>Cantidad: ${item.quantity}</span><br />
        <span>Precio: ${formatCRC(item.price)}</span> | <strong>Subtotal: ${formatCRC(item.price * item.quantity)}</strong>
        ${specsHtml}</div></li>`;
    }).join("");

    const crDate = new Date().toLocaleString("es-CR", {
      timeZone: "America/Costa_Rica",
      dateStyle: "full",
      timeStyle: "medium",
    });
    const html = `<h1>Nuevo pedido recibido</h1>
      <p><strong>Número de pedido:</strong> ${orderId}</p>
      <p><strong>Fecha y Hora:</strong> ${escapeHtml(crDate)}</p>
      <p><strong>Nombre:</strong> ${escapeHtml(customer.name)}</p>
      <p><strong>Correo:</strong> ${escapeHtml(customer.email)}</p>
      <p><strong>Teléfono:</strong> ${escapeHtml(customer.phone || "No indicado")}</p>
      <p><strong>Dirección:</strong> ${escapeHtml(customer.address || "No indicada")}</p>
      <h2>Productos solicitados</h2><ul>${itemsHtml}</ul>
      <p><strong>Total del pedido:</strong> ${formatCRC(calculatedTotal)}</p>`;

    const storeEmail = process.env.STORE_EMAIL;
    let emailSent = false;
    if (storeEmail && process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "Tienda Virtual <onboarding@resend.dev>",
        to: [storeEmail],
        subject: `Nuevo pedido #${orderId} de ${customer.name}`,
        html,
        replyTo: customer.email,
      });
      emailSent = true;
    } else {
      console.warn("Pedido creado sin email: faltan STORE_EMAIL o RESEND_API_KEY.");
    }

    return NextResponse.json({ success: true, orderId, calculatedTotal, emailSent });
  } catch (error) {
    console.error("Error procesando pedido:", error);
    return NextResponse.json({ error: "No se pudo procesar el pedido" }, { status: 500 });
  }
}
