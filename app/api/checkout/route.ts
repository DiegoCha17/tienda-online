import { NextResponse } from 'next/server';
import { resend } from '@/lib/mail';
import { sql } from '@/lib/db';
import { formatCRC } from '@/lib/currency';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, cart, total } = body;

    if (!customer?.name || !customer?.email || !cart?.length) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    const orderResult = await sql`
      INSERT INTO orders (
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        total
      )
      VALUES (
        ${customer.name},
        ${customer.email},
        ${customer.phone || ''},
        ${customer.address || ''},
        ${total}
      )
      RETURNING id
    `;

    const orderId = orderResult[0].id;

    for (const item of cart) {
      await sql`
        INSERT INTO order_items (
          order_id,
          product_id,
          product_name,
          product_price,
          quantity,
          subtotal
        )
        VALUES (
          ${orderId},
          ${item.id},
          ${item.name},
          ${item.price},
          ${item.quantity},
          ${item.price * item.quantity}
        )
      `;
    }

    const itemsHtml = cart
      .map(
        (item: any) => `
      <li style="display: flex; align-items: center; margin-bottom: 10px;">
        <img src="${item.image_url || 'https://via.placeholder.com/80'}" alt="${item.name}" width="60" height="60" style="border-radius: 8px; object-fit: cover; margin-right: 15px; border: 1px solid #ddd;" />
        <div>
          <strong>${item.name}</strong><br />
          <span>Cantidad: ${item.quantity}</span><br />
          <span>Precio: ${formatCRC(item.price)}</span> | 
          <strong>Subtotal: ${formatCRC(item.price * item.quantity)}</strong>
        </div>
      </li>
    `
      )
      .join('');

    const crDate = new Date().toLocaleString('es-CR', {
      timeZone: 'America/Costa_Rica',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const html = `
      <h1>Nuevo pedido recibido</h1>
      <p><strong>Número de pedido:</strong> ${orderId}</p>
      <p><strong>Fecha y Hora:</strong> ${crDate}</p>
      <p><strong>Nombre:</strong> ${customer.name}</p>
      <p><strong>Correo:</strong> ${customer.email}</p>
      <p><strong>Teléfono:</strong> ${customer.phone || 'No indicado'}</p>
      <p><strong>Dirección:</strong> ${customer.address || 'No indicada'}</p>

      <h2>Productos solicitados</h2>
      <ul>
        ${itemsHtml}
      </ul>

      <p><strong>Total del pedido:</strong> ${formatCRC(total)}</p>
    `;

    const emailResult = await resend.emails.send({
      from: 'Tienda Virtual <onboarding@resend.dev>',
      to: [process.env.STORE_EMAIL!],
      subject: `Nuevo pedido #${orderId} de ${customer.name}`,
      html,
      replyTo: customer.email,
    });

    return NextResponse.json({
      success: true,
      orderId,
      emailResult,
    });
  } catch (error) {
    console.error('Error enviando pedido:', error);

    return NextResponse.json(
      { error: 'No se pudo procesar el pedido' },
      { status: 500 }
    );
  }
}