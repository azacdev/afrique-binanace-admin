import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/drizzle";
import { schedules } from "@/db/schema";

// GET all active schedules (public - no auth required)
// This endpoint is consumed by the afriquebitcoin frontend
export async function GET() {
  try {
    const activeSchedules = await db
      .select()
      .from(schedules)
      .where(eq(schedules.isActive, true))
      .orderBy(schedules.startTime);

    return NextResponse.json({ schedules: activeSchedules });
  } catch (error) {
    console.error("Error fetching public schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
      { status: 500 },
    );
  }
}
