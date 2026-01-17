import { eq, and, isNull, gt } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

import { db } from "@/db/drizzle";
import { invitations } from "@/db/schema";

// POST mark invitation as used
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
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
      return NextResponse.json(
        { error: "Invalid or expired invitation" },
        { status: 400 }
      );
    }

    await db
      .update(invitations)
      .set({
        usedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(invitations.id, invitation.id));

    return NextResponse.json({ message: "Invitation marked as used" });
  } catch (error) {
    console.error("Error using invitation:", error);
    return NextResponse.json(
      { error: "Failed to mark invitation as used" },
      { status: 500 }
    );
  }
}
