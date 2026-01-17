import { headers } from "next/headers";
import { desc } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { tickets } from "@/db/schema";

// GET all tickets (protected - admin only)
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allTickets = await db
      .select()
      .from(tickets)
      .orderBy(desc(tickets.createdAt));

    return NextResponse.json({ tickets: allTickets });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

// POST create new ticket (protected - admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const [ticket] = await db
      .insert(tickets)
      .values({
        startTime: body.startTime,
        endTime: body.endTime,
        type: body.type,
        title: body.title,
        description: body.description,
        speaker: body.speaker || null,
        duration: body.duration,
        focus: body.focus || null,
        link: body.link,
        isActive: body.isActive ?? true,
      })
      .returning();

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
