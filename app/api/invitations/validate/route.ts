import { eq, and, isNull, gt } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

import { db } from "@/db/drizzle";
import { invitations } from "@/db/schema";

// POST validate invitation token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { valid: false, error: "Token is required" },
        { status: 400 }
      );
    }

    const [invitation] = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.token, token),
          isNull(invitations.usedAt),
          gt(invitations.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!invitation) {
      return NextResponse.json({
        valid: false,
        error: "Invalid or expired invitation link",
      });
    }

    return NextResponse.json({
      valid: true,
      email: invitation.email,
    });
  } catch (error) {
    console.error("Error validating invitation:", error);
    return NextResponse.json(
      { valid: false, error: "Failed to validate invitation" },
      { status: 500 }
    );
  }
}
