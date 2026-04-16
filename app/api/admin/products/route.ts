import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get('admin_auth')?.value === 'true';

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await req.json();

    const name = body.name?.trim();
    const description = body.description?.trim() || '';
    const image_url = body.image_url?.trim() || '';
    const category = body.category?.trim() || 'General';
    const price = Number(body.price);
    const stock = Number(body.stock ?? 0);

    if (!name) {
      return NextResponse.json(
        { error: 'El nombre es obligatorio' },
        { status: 400 }
      );
    }

    if (Number.isNaN(price) || price <= 0) {
      return NextResponse.json(
        { error: 'El precio debe ser un número válido mayor a 0' },
        { status: 400 }
      );
    }

    if (Number.isNaN(stock) || stock < 0) {
      return NextResponse.json(
        { error: 'El stock debe ser un número válido' },
        { status: 400 }
      );
    }

    const images = Array.isArray(body.images) ? body.images : [];
    const specifications = typeof body.specifications === 'object' ? body.specifications : {};
    const features = typeof body.features === 'object' ? body.features : {};

    const result = await sql`
      INSERT INTO products (
        name,
        description,
        price,
        image_url,
        stock,
        category,
        active,
        images,
        specifications,
        features
      )
      VALUES (
        ${name},
        ${description},
        ${price},
        ${image_url},
        ${stock},
        ${category},
        TRUE,
        ${JSON.stringify(images)},
        ${JSON.stringify(specifications)},
        ${JSON.stringify(features)}
      )
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      productId: result[0].id,
    });
  } catch (error) {
    console.error('Error creando producto:', error);

    return NextResponse.json(
      {
        error: 'No se pudo crear el producto',
        details: String(error),
      },
      { status: 500 }
    );
  }
}