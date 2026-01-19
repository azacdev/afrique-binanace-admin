"use client";

import { useEffect, useState } from "react";
import { Plus, Mail, Clock, CheckCircle2, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface Invitation {
  id: string;
  email: string;
  createdByName: string;
  usedByName: string | null;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
}

export default function SettingsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [deleteInvitation, setDeleteInvitation] = useState<Invitation | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "" },
  });

  const fetchInvitations = async () => {
    try {
      const response = await fetch("/api/invitations");
      if (response.ok) {
        const data = await response.json();
        setInvitations(data.invitations || []);
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const onSubmit = async (data: InviteFormData) => {
    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Invitation sent successfully!");
        setIsInviteDialogOpen(false);
        reset();
        fetchInvitations();
      } else {
        toast.error(result.error || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation");
    }
  };

  const getInvitationStatus = (invitation: Invitation) => {
    if (invitation.usedAt) {
      return { label: "Used", color: "bg-[#6CBF6D] text-white" };
    }
    const expiresAt = new Date(invitation.expiresAt);
    if (expiresAt < new Date()) {
      return { label: "Expired", color: "bg-red-100 text-red-800" };
    }
    return { label: "Pending", color: "bg-yellow-100 text-yellow-800" };
  };

  const handleDelete = async () => {
    if (!deleteInvitation) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/invitations/${deleteInvitation.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Invitation deleted successfully");
        setDeleteInvitation(null);
        fetchInvitations();
      } else {
        toast.error("Failed to delete invitation");
      }
    } catch (error) {
      console.error("Error deleting invitation:", error);
      toast.error("Failed to delete invitation");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#155E63]">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage admin invitations and portal settings
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-[#155E63]">Admin Invitations</CardTitle>
            <CardDescription>
              Invite new administrators to the portal
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsInviteDialogOpen(true)}
            className="bg-[#155E63] hover:bg-[#0f4a4e] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Invite Admin
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Invited By</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Used By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 rounded ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No invitations yet. Send your first invitation!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Invited By</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Used By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => {
                  const status = getInvitationStatus(invitation);
                  return (
                    <TableRow key={invitation.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {invitation.email}
                        </div>
                      </TableCell>
                      <TableCell>{invitation.createdByName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {formatDate(invitation.expiresAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        {invitation.usedByName ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#6CBF6D]" />
                            {invitation.usedByName}
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteInvitation(invitation)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Invite Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#155E63]">
              Invite New Admin
            </DialogTitle>
            <DialogDescription>
              Send an invitation email to add a new administrator to the portal.
              The invitation will expire in 7 days.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldSet>
              <Field data-invalid={!!errors.email}>
                <FieldLabel>Email Address *</FieldLabel>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="admin@example.com"
                  className="border-gray-300 focus:border-[#155E63] focus:ring-[#155E63]"
                />
                <FieldError>{errors.email?.message}</FieldError>
              </Field>
            </FieldSet>

            <DialogFooter className="mt-6 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsInviteDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#155E63] hover:bg-[#0f4a4e] text-white"
              >
                {isSubmitting ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteInvitation}
        onOpenChange={() => setDeleteInvitation(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Delete Invitation
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the invitation for "
              {deleteInvitation?.email}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteInvitation(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
