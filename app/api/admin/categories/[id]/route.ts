import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { cookies } from 'next/headers';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get('admin_auth')?.value === 'true';

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const categoryRows = await sql`
      SELECT name
      FROM categories
      WHERE id = ${Number(id)}
    `;

    if (categoryRows.length === 0) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    const categoryName = categoryRows[0].name;

    if (categoryName === 'General') {
      return NextResponse.json(
        { error: 'No se puede eliminar la categoría General' },
        { status: 400 }
      );
    }

    await sql`
      UPDATE products
      SET category = 'General'
      WHERE category = ${categoryName}
    `;

    await sql`
      DELETE FROM categories
      WHERE id = ${Number(id)}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error eliminando categoría:', error);

    return NextResponse.json(
      { error: 'No se pudo eliminar la categoría' },
      { status: 500 }
    );
  }
}