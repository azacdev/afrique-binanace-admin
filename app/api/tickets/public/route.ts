import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/drizzle";
import { tickets } from "@/db/schema";

// GET all active tickets (public - no auth required)
// This endpoint is consumed by the afriquebitcoin frontend
export async function GET() {
  try {
    const activeTickets = await db
      .select()
      .from(tickets)
      .where(eq(tickets.isActive, true))
      .orderBy(tickets.startTime);

    return NextResponse.json({ tickets: activeTickets });
  } catch (error) {
    console.error("Error fetching public tickets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}
