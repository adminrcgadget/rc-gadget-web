import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const expectedEmail = process.env.ADMIN_EMAIL || "admin@rcgadgets.com";
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (
      email?.trim().toLowerCase() === expectedEmail.trim().toLowerCase() &&
      password === expectedPassword
    ) {
      const response = NextResponse.json({
        success: true,
        message: "Authenticated successfully",
      });

      // Set cookie for 7 days
      response.cookies.set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Authentication error" },
      { status: 500 }
    );
  }
}
