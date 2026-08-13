import { NextResponse } from "next/server";
import { resend } from "@/lib/mail";
import { sql } from "@/lib/db";
import { formatCRC } from "@/lib/currency";

// Rate limiting sencillo en memoria (para producción mejor usar Redis)
const rateLimit = new Map<string, { count: number; timestamp: number }>();

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting Básico (IP tracking simple)
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const limitInfo = rateLimit.get(ip);
    
    if (limitInfo) {
      if (now - limitInfo.timestamp < 60000) { // 1 minuto
        if (limitInfo.count >= 5) {
          return NextResponse.json({ error: "Demasiados intentos. Espera 1 minuto." }, { status: 429 });
        }
        limitInfo.count += 1;
      } else {
        rateLimit.set(ip, { count: 1, timestamp: now });
      }
    } else {
      rateLimit.set(ip, { count: 1, timestamp: now });
    }

    const body = await req.json();
    const { customer, cart } = body;
    
    if (!customer?.name || !customer?.email || !cart?.length) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // 2. Validación de precios y stock desde la Base de Datos
    let calculatedTotal = 0;
    const validatedCart = [];

    // Verificamos producto por producto
    for (const item of cart) {
      const dbProductResult = await sql`SELECT id, name, price, stock, active FROM products WHERE id = ${item.id}`;
      
      if (dbProductResult.length === 0) {
        return NextResponse.json({ error: \`El producto \${item.name} ya no existe.\` }, { status: 400 });
      }

      const dbProduct = dbProductResult[0];

      if (!dbProduct.active) {
        return NextResponse.json({ error: \`El producto \${dbProduct.name} no está disponible.\` }, { status: 400 });
      }

      if (dbProduct.stock < item.quantity) {
        return NextResponse.json({ error: \`No hay suficiente stock para \${dbProduct.name}. Disponible: \${dbProduct.stock}\` }, { status: 400 });
      }

      // Sumamos con el precio REAL de la DB, no el del cliente
      calculatedTotal += Number(dbProduct.price) * item.quantity;
      
      validatedCart.push({
        ...item,
        dbPrice: Number(dbProduct.price)
      });
    }

    // Usar transacciones para asegurar atomicidad
    const orderResult = await sql.begin(async (sql) => {
      // 3. Crear Orden
      const order = await sql\`
        INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, total)
        VALUES (\${customer.name}, \${customer.email}, \${customer.phone || ""}, \${customer.address || ""}, \${calculatedTotal})
        RETURNING id
      \`;
      const orderId = order[0].id;

      // 4. Insertar Items y Descontar Stock
      for (const item of validatedCart) {
        await sql\`
          INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, subtotal)
          VALUES (\${orderId}, \${item.id}, \${item.name}, \${item.dbPrice}, \${item.quantity}, \${item.dbPrice * item.quantity})
        \`;

        // Descontar stock
        await sql\`
          UPDATE products
          SET stock = stock - \${item.quantity}
          WHERE id = \${item.id}
        \`;
      }
      return orderId;
    });

    const orderId = orderResult;

    // 5. Enviar Email
    const itemsHtml = validatedCart
      .map((item: any) => {
        let specStr = "";
        if (item.selectedSpecs && Object.keys(item.selectedSpecs).length > 0) {
          const specsText = Object.entries(item.selectedSpecs)
            .map(([k, v]) => \`<b>\${k}:</b> \${v}\`)
            .join(" | ");
          specStr = \`<br /><span style="color: #666; font-size: 0.9em;">Especificaciones: \${specsText}</span>\`;
        }
        return \`<li style="display: flex; align-items: center; margin-bottom: 10px;">
          <img src="\${item.image_url || "https://via.placeholder.com/80"}" alt="\${item.name}" width="60" height="60" style="border-radius: 8px; object-fit: cover; margin-right: 15px; border: 1px solid #ddd;" />
          <div>
            <strong>\${item.name}</strong><br />
            <span>Cantidad: \${item.quantity}</span><br />
            <span>Precio: \${formatCRC(item.dbPrice)}</span> | <strong>Subtotal: \${formatCRC(item.dbPrice * item.quantity)}</strong>
            \${specStr}
          </div>
        </li>\`;
      })
      .join("");
      
    const crDate = new Date().toLocaleString("es-CR", {
      timeZone: "America/Costa_Rica",
      dateStyle: "full",
      timeStyle: "medium",
    });

    const html = \`
      <h1>Nuevo pedido recibido</h1>
      <p><strong>Número de pedido:</strong> \${orderId}</p>
      <p><strong>Fecha y Hora:</strong> \${crDate}</p>
      <p><strong>Nombre:</strong> \${customer.name}</p>
      <p><strong>Correo:</strong> \${customer.email}</p>
      <p><strong>Teléfono:</strong> \${customer.phone || "No indicado"}</p>
      <p><strong>Dirección:</strong> \${customer.address || "No indicada"}</p>
      <h2>Productos solicitados</h2>
      <ul>\${itemsHtml}</ul>
      <p><strong>Total del pedido:</strong> \${formatCRC(calculatedTotal)}</p>
    \`;

    const emailResult = await resend.emails.send({
      from: "Tienda Virtual <onboarding@resend.dev>",
      to: [process.env.STORE_EMAIL!],
      subject: \`Nuevo pedido #\${orderId} de \${customer.name}\`,
      html,
      replyTo: customer.email,
    });

    return NextResponse.json({ success: true, orderId, emailResult, calculatedTotal });
  } catch (error) {
    console.error("Error enviando pedido:", error);
    return NextResponse.json(
      { error: "No se pudo procesar el pedido" },
      { status: 500 },
    );
  }
}
