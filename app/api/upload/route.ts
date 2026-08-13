import { NextResponse } from "next/server";
import { isValidAdminToken } from "@/lib/admin-auth";
export async function POST(req: Request) {
  try {
    const token = req.headers.get("cookie")?.match(/(?:^|;\s*)admin_auth=([^;]+)/)?.[1];
    if (!isValidAdminToken(token)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No se envió archivo" },
        { status: 400 },
      );
    }
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "La imagen debe ser válida y pesar menos de 5 MB" }, { status: 400 });
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName) return NextResponse.json({ error: "Servicio de imágenes no configurado" }, { status: 503 });
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "unsigned_upload");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: uploadData },
    );
    const data = await res.json();
    if (!res.ok || typeof data.secure_url !== "string") return NextResponse.json({ error: "Cloudinary no pudo procesar la imagen" }, { status: 502 });
    return NextResponse.json({ url: data.secure_url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error subiendo imagen" },
      { status: 500 },
    );
  }
}
