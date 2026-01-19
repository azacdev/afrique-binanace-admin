import { headers } from "next/headers";
import { desc } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { schedules } from "@/db/schema";

// GET all schedules (protected - admin only)
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allSchedules = await db
      .select()
      .from(schedules)
      .orderBy(desc(schedules.createdAt));

    return NextResponse.json({ schedules: allSchedules });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
      { status: 500 },
    );
  }
}

// POST create new schedule (protected - admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const [schedule] = await db
      .insert(schedules)
      .values({
        startTime: body.startTime,
        endTime: body.endTime,
        type: body.type,
        title: body.title,
        description: body.description,
        speaker: body.speaker || null,
        duration: body.duration,
        focus: body.focus || null,
        isActive: body.isActive ?? true,
      })
      .returning();

    return NextResponse.json({ schedule });
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json(
      { error: "Failed to create schedule" },
      { status: 500 },
    );
  }
}
