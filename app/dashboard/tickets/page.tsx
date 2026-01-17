"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TicketFormDialog } from "@/components/dashboard/ticket-form-dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface Ticket {
  id: string;
  startTime: string;
  endTime: string;
  type: string;
  title: string;
  description: string;
  speaker: string | null;
  duration: string;
  focus: string | null;
  link: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [deleteTicket, setDeleteTicket] = useState<Ticket | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/tickets");
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDelete = async () => {
    if (!deleteTicket) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tickets/${deleteTicket.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Ticket deleted successfully");
        setDeleteTicket(null);
        fetchTickets();
      } else {
        toast.error("Failed to delete ticket");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast.error("Failed to delete ticket");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingTicket(null);
    fetchTickets();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#155E63]">Tickets</h1>
          <p className="text-gray-600 mt-1">
            Manage conference sessions and schedule
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-[#155E63] hover:bg-[#0f4a4e] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Ticket
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#155E63]">All Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Speaker</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tickets found. Create your first ticket!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Speaker</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="text-[#155E63]">{ticket.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {ticket.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-[#155E63]/10 text-[#155E63] border-[#155E63]/30"
                      >
                        {ticket.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>
                        <p>
                          {ticket.startTime} - {ticket.endTime}
                        </p>
                        <p className="text-gray-500">{ticket.duration}</p>
                      </div>
                    </TableCell>
                    <TableCell>{ticket.speaker || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={ticket.isActive ? "default" : "secondary"}
                        className={
                          ticket.isActive
                            ? "bg-[#6CBF6D] text-white"
                            : "bg-gray-200 text-gray-600"
                        }
                      >
                        {ticket.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(ticket.link, "_blank")}
                          className="text-gray-500 hover:text-[#155E63]"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingTicket(ticket);
                            setIsFormOpen(true);
                          }}
                          className="text-gray-500 hover:text-[#155E63]"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTicket(ticket)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Form Dialog */}
      <TicketFormDialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingTicket(null);
        }}
        ticket={editingTicket}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTicket} onOpenChange={() => setDeleteTicket(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Ticket</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteTicket?.title}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTicket(null)}
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
