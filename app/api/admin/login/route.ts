import { NextResponse } from "next/server";
import { createAdminToken } from "@/lib/admin-auth";
export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 },
      );
    }
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_auth", createAdminToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return response;
  } catch {
    return NextResponse.json(
      { error: "Error en autenticación" },
      { status: 500 },
    );
  }
}
