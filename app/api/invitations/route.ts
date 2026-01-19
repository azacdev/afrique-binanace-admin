import { Resend } from "resend";
import { headers } from "next/headers";
import { eq, and, isNull, gt, desc } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { invitations, user } from "@/db/schema";
import { InvitationEmail } from "@/emails/invitation-email";

const resend = new Resend(process.env.RESEND_API_KEY);

// POST create invitation (protected)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Check if there's already a pending invitation
    const existingInvite = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.email, email),
          isNull(invitations.usedAt),
          gt(invitations.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (existingInvite.length > 0) {
      return NextResponse.json(
        { error: "Invitation already sent to this email" },
        { status: 400 },
      );
    }

    // Generate invitation token
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    // Create invitation
    const [invitation] = await db
      .insert(invitations)
      .values({
        email,
        token,
        createdBy: session.user.id,
        expiresAt,
      })
      .returning();

    // Send invitation email
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/signup?token=${token}`;

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "admin@azacdev.com",
      to: email,
      subject: "Invitation to Afrique Bitcoin Admin Portal",
      react: InvitationEmail({
        email,
        inviteUrl,
        expiresAt,
      }),
    });

    // Check if email sending failed
    if (emailError) {
      console.error("Resend email error:", emailError);

      // Delete the invitation since email failed
      await db.delete(invitations).where(eq(invitations.id, invitation.id));

      return NextResponse.json(
        { error: `Failed to send invitation email: ${emailError.message}` },
        { status: 500 },
      );
    }

    console.log("Invitation email sent successfully:", emailData?.id);

    return NextResponse.json({
      message: "Invitation sent successfully",
      invitation: {
        id: invitation.id,
        email: invitation.email,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      { error: "Failed to create invitation" },
      { status: 500 },
    );
  }
}

// GET all invitations (protected)
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allInvitations = await db
      .select({
        id: invitations.id,
        email: invitations.email,
        createdBy: invitations.createdBy,
        usedBy: invitations.usedBy,
        expiresAt: invitations.expiresAt,
        usedAt: invitations.usedAt,
        createdAt: invitations.createdAt,
      })
      .from(invitations)
      .orderBy(desc(invitations.createdAt));

    // Get names for each invitation
    const invitationsWithNames = await Promise.all(
      allInvitations.map(async (invitation) => {
        // Get creator name
        const [creator] = await db
          .select({ name: user.name })
          .from(user)
          .where(eq(user.id, invitation.createdBy))
          .limit(1);

        // Get used by name if exists
        let usedByName = null;
        if (invitation.usedBy) {
          const [usedByUser] = await db
            .select({ name: user.name })
            .from(user)
            .where(eq(user.id, invitation.usedBy))
            .limit(1);
          usedByName = usedByUser?.name || null;
        }

        return {
          ...invitation,
          createdByName: creator?.name || "Unknown",
          usedByName,
        };
      }),
    );

    return NextResponse.json({ invitations: invitationsWithNames });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 },
    );
  }
}
