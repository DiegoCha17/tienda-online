import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se envió archivo' },
        { status: 400 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', 'unsigned_upload');

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: uploadData,
      }
    );

    const data = await res.json();

    return NextResponse.json({
      url: data.secure_url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Error subiendo imagen' },
      { status: 500 }
    );
  }
}