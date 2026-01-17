"use client";

import { z } from "zod";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

const ticketSchema = z.object({
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  type: z.string().min(1, "Type is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  speaker: z.string().optional(),
  duration: z.string().min(1, "Duration is required"),
  focus: z.string().optional(),
  link: z.string().url("Must be a valid URL"),
  isActive: z.boolean(),
});

type TicketFormData = z.infer<typeof ticketSchema>;

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
}

interface TicketFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket | null;
  onSuccess: () => void;
}

export function TicketFormDialog({
  open,
  onOpenChange,
  ticket,
  onSuccess,
}: TicketFormDialogProps) {
  const isEditing = !!ticket;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      startTime: "",
      endTime: "",
      type: "",
      title: "",
      description: "",
      speaker: "",
      duration: "",
      focus: "",
      link: "",
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  useEffect(() => {
    if (ticket) {
      reset({
        startTime: ticket.startTime,
        endTime: ticket.endTime,
        type: ticket.type,
        title: ticket.title,
        description: ticket.description,
        speaker: ticket.speaker || "",
        duration: ticket.duration,
        focus: ticket.focus || "",
        link: ticket.link,
        isActive: ticket.isActive,
      });
    } else {
      reset({
        startTime: "",
        endTime: "",
        type: "",
        title: "",
        description: "",
        speaker: "",
        duration: "",
        focus: "",
        link: "",
        isActive: true,
      });
    }
  }, [ticket, reset]);

  const onSubmit = async (data: TicketFormData) => {
    try {
      const url = isEditing ? `/api/tickets/${ticket.id}` : "/api/tickets";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          speaker: data.speaker || null,
          focus: data.focus || null,
        }),
      });

      if (response.ok) {
        toast.success(
          isEditing
            ? "Ticket updated successfully"
            : "Ticket created successfully",
        );
        onSuccess();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to save ticket");
      }
    } catch (error) {
      console.error("Error saving ticket:", error);
      toast.error("Failed to save ticket");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:!max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-1 pb-6 border-b border-[#e5e5e0]">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-rg-standard-book text-xl text-[#155E63]">
              {isEditing ? "Edit Ticket" : "Create Ticket"}
            </SheetTitle>
          </div>
          <SheetDescription className="text-[#337875] text-sm">
            {isEditing
              ? "Update the ticket details below."
              : "Fill in the details for the new conference ticket."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
          <FieldSet className="gap-5">
            <FieldGroup className="gap-4">
              {/* Title */}
              <Field data-invalid={!!errors.title}>
                <FieldLabel className="text-[#155E63] text-sm font-medium">
                  Title <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...register("title")}
                  placeholder="Enter ticket title"
                  className="h-10 border-[#e5e5e0] focus:border-[#155E63] focus:ring-[#155E63]/20"
                />
                <FieldError>{errors.title?.message}</FieldError>
              </Field>

              {/* Type */}
              <Field data-invalid={!!errors.type}>
                <FieldLabel className="text-[#155E63] text-sm font-medium">
                  Type <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...register("type")}
                  placeholder="e.g., KEYNOTE, PANEL, WORKSHOP"
                  className="h-10 border-[#e5e5e0] focus:border-[#155E63] focus:ring-[#155E63]/20"
                />
                <FieldError>{errors.type?.message}</FieldError>
              </Field>

              {/* Time Row */}
              <div className="grid grid-cols-2 gap-3">
                <Field data-invalid={!!errors.startTime}>
                  <FieldLabel className="text-[#155E63] text-sm font-medium">
                    Start Time <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...register("startTime")}
                    placeholder="e.g., 09:00 AM"
                    className="h-10 border-[#e5e5e0] focus:border-[#155E63] focus:ring-[#155E63]/20"
                  />
                  <FieldError>{errors.startTime?.message}</FieldError>
                </Field>

                <Field data-invalid={!!errors.endTime}>
                  <FieldLabel className="text-[#155E63] text-sm font-medium">
                    End Time <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...register("endTime")}
                    placeholder="e.g., 10:30 AM"
                    className="h-10 border-[#e5e5e0] focus:border-[#155E63] focus:ring-[#155E63]/20"
                  />
                  <FieldError>{errors.endTime?.message}</FieldError>
                </Field>
              </div>

              {/* Duration */}
              <Field data-invalid={!!errors.duration}>
                <FieldLabel className="text-[#155E63] text-sm font-medium">
                  Duration <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...register("duration")}
                  placeholder="e.g., 90 MIN"
                  className="h-10 border-[#e5e5e0] focus:border-[#155E63] focus:ring-[#155E63]/20"
                />
                <FieldError>{errors.duration?.message}</FieldError>
              </Field>

              {/* Description */}
              <Field data-invalid={!!errors.description}>
                <FieldLabel className="text-[#155E63] text-sm font-medium">
                  Description <span className="text-red-500">*</span>
                </FieldLabel>
                <Textarea
                  {...register("description")}
                  placeholder="Enter ticket description..."
                  className="min-h-[100px] border-[#e5e5e0] focus:border-[#155E63] focus:ring-[#155E63]/20 resize-none"
                />
                <FieldError>{errors.description?.message}</FieldError>
              </Field>

              {/* Speaker */}
              <Field data-invalid={!!errors.speaker}>
                <FieldLabel className="text-[#155E63] text-sm font-medium">
                  Speaker
                </FieldLabel>
                <Input
                  {...register("speaker")}
                  placeholder="Speaker name (optional)"
                  className="h-10 border-[#e5e5e0] focus:border-[#155E63] focus:ring-[#155E63]/20"
                />
                <FieldError>{errors.speaker?.message}</FieldError>
              </Field>

              {/* Focus */}
              <Field data-invalid={!!errors.focus}>
                <FieldLabel className="text-[#155E63] text-sm font-medium">
                  Focus Area
                </FieldLabel>
                <Input
                  {...register("focus")}
                  placeholder="e.g., ECONOMY, REGULATION (optional)"
                  className="h-10 border-[#e5e5e0] focus:border-[#155E63] focus:ring-[#155E63]/20"
                />
                <FieldError>{errors.focus?.message}</FieldError>
              </Field>

              {/* Link */}
              <Field data-invalid={!!errors.link}>
                <FieldLabel className="text-[#155E63] text-sm font-medium">
                  Link <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...register("link")}
                  placeholder="https://example.com/ticket"
                  className="h-10 border-[#e5e5e0] focus:border-[#155E63] focus:ring-[#155E63]/20"
                />
                <FieldError>{errors.link?.message}</FieldError>
              </Field>

              {/* Active Toggle */}
              <div className="flex items-center justify-between py-2 px-3 bg-[#F5F5EE] rounded-lg">
                <div>
                  <p className="text-sm font-medium text-[#155E63]">Active</p>
                  <p className="text-xs text-[#337875]">
                    Make this ticket visible on the website
                  </p>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                  className="data-[state=checked]:bg-[#6CBF6D]"
                />
              </div>
            </FieldGroup>
          </FieldSet>

          {/* Footer Actions */}
          <div className="flex items-center gap-3 pt-6 mt-6 border-t border-[#e5e5e0]">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1 h-10 border-[#e5e5e0] text-[#337875] hover:bg-[#F5F5EE] hover:text-[#155E63]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-10 bg-[#155E63] hover:bg-[#0f4a4e] text-white"
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Update Ticket"
                  : "Create Ticket"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
