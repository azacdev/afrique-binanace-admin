interface InvitationValidation {
  valid: boolean;
  email?: string;
  error?: string;
}

export async function validateInvitation(
  token: string
): Promise<InvitationValidation> {
  try {
    const response = await fetch("/api/invitations/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (response.ok && data.valid) {
      return {
        valid: true,
        email: data.email,
      };
    } else {
      return {
        valid: false,
        error: data.error || "Invalid invitation link",
      };
    }
  } catch (error) {
    console.error("Token validation error:", error);
    return {
      valid: false,
      error: "Failed to validate invitation",
    };
  }
}

export async function useInvitation(token: string): Promise<void> {
  const response = await fetch("/api/invitations/use", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    throw new Error("Failed to mark invitation as used");
  }
}
