import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { cookies } from 'next/headers';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get('admin_auth')?.value === 'true';

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await sql`
      DELETE FROM products
      WHERE id = ${Number(id)}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error eliminando producto:', error);

    return NextResponse.json(
      { error: 'No se pudo eliminar el producto' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get('admin_auth')?.value === 'true';

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    const {
      name,
      description,
      price,
      image_url,
      stock,
      category,
      active,
      images,
      specifications,
      features,
    } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: 'Nombre y precio son obligatorios' },
        { status: 400 }
      );
    }

    await sql`
      UPDATE products
      SET
        name = ${name},
        description = ${description || ''},
        price = ${price},
        image_url = ${image_url || ''},
        stock = ${stock || 0},
        category = ${category || 'General'},
        active = ${active},
        images = ${JSON.stringify(images || [])},
        specifications = ${JSON.stringify(specifications || {})},
        features = ${JSON.stringify(features || {})}
      WHERE id = ${Number(id)}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error actualizando producto:', error);

    return NextResponse.json(
      { error: 'No se pudo actualizar el producto' },
      { status: 500 }
    );
  }
}