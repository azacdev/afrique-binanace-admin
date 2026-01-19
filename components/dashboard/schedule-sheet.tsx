"use client";

import { z } from "zod";
import { toast } from "sonner";
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

// Helper function to calculate duration from start and end time
function calculateDuration(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return "";

  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  let startTotalMinutes = startHours * 60 + startMinutes;
  let endTotalMinutes = endHours * 60 + endMinutes;

  // Handle overnight sessions (e.g., 22:00 - 02:00)
  if (endTotalMinutes < startTotalMinutes) {
    endTotalMinutes += 24 * 60;
  }

  const durationMinutes = endTotalMinutes - startTotalMinutes;

  if (durationMinutes < 60) {
    return `${durationMinutes} MIN`;
  } else if (durationMinutes % 60 === 0) {
    const hours = durationMinutes / 60;
    return hours === 1 ? "1 HOUR" : `${hours} HOURS`;
  } else {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}H ${minutes}M`;
  }
}

const scheduleSchema = z.object({
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  type: z.string().min(1, "Type is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  speaker: z.string().optional(),
  focus: z.string().optional(),
  isActive: z.boolean(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

interface Schedule {
  id: string;
  startTime: string;
  endTime: string;
  type: string;
  title: string;
  description: string;
  speaker: string | null;
  duration: string;
  focus: string | null;
  isActive: boolean;
}

interface ScheduleSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: Schedule | null;
  onSuccess: () => void;
}

export function ScheduleSheet({
  open,
  onOpenChange,
  schedule,
  onSuccess,
}: ScheduleSheetProps) {
  const isEditing = !!schedule;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      startTime: "",
      endTime: "",
      type: "",
      title: "",
      description: "",
      speaker: "",
      focus: "",
      isActive: true,
    },
  });

  const isActive = watch("isActive");
  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const calculatedDuration = calculateDuration(startTime, endTime);

  useEffect(() => {
    if (schedule) {
      reset({
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        type: schedule.type,
        title: schedule.title,
        description: schedule.description,
        speaker: schedule.speaker || "",
        focus: schedule.focus || "",
        isActive: schedule.isActive,
      });
    } else {
      reset({
        startTime: "",
        endTime: "",
        type: "",
        title: "",
        description: "",
        speaker: "",
        focus: "",
        isActive: true,
      });
    }
  }, [schedule, reset]);

  const onSubmit = async (data: ScheduleFormData) => {
    // Calculate duration from start and end time
    const duration = calculateDuration(data.startTime, data.endTime);

    if (!duration) {
      toast.error("Please ensure both start and end times are valid");
      return;
    }

    try {
      const url = isEditing
        ? `/api/schedules/${schedule.id}`
        : "/api/schedules";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          duration,
          speaker: data.speaker || null,
          focus: data.focus || null,
        }),
      });

      if (response.ok) {
        toast.success(
          isEditing
            ? "Schedule updated successfully"
            : "Schedule created successfully",
        );
        onSuccess();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to save schedule");
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error("Failed to save schedule");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:!max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-1 pb-6 border-b border-[#e5e5e0]">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-rg-standard-book text-xl text-[#155E63]">
              {isEditing ? "Edit Schedule" : "Create Schedule"}
            </SheetTitle>
          </div>
          <SheetDescription className="text-[#337875] text-sm">
            {isEditing
              ? "Update the schedule details below."
              : "Fill in the details for the new conference schedule."}
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
                  placeholder="Enter schedule title"
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
                    type="time"
                    {...register("startTime")}
                    className="h-10 border-[#e5e5e0] focus:border-[#155E63] focus:ring-[#155E63]/20"
                  />
                  <FieldError>{errors.startTime?.message}</FieldError>
                </Field>

                <Field data-invalid={!!errors.endTime}>
                  <FieldLabel className="text-[#155E63] text-sm font-medium">
                    End Time <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    type="time"
                    {...register("endTime")}
                    className="h-10 border-[#e5e5e0] focus:border-[#155E63] focus:ring-[#155E63]/20"
                  />
                  <FieldError>{errors.endTime?.message}</FieldError>
                </Field>
              </div>

              {/* Duration Preview */}
              {calculatedDuration && (
                <div className="py-2 px-3 bg-[#155E63]/5 rounded-lg border border-[#155E63]/20">
                  <p className="text-xs text-[#337875]">Calculated Duration</p>
                  <p className="text-sm font-medium text-[#155E63]">
                    {calculatedDuration}
                  </p>
                </div>
              )}

              {/* Description */}
              <Field data-invalid={!!errors.description}>
                <FieldLabel className="text-[#155E63] text-sm font-medium">
                  Description <span className="text-red-500">*</span>
                </FieldLabel>
                <Textarea
                  {...register("description")}
                  placeholder="Enter schedule description..."
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

              {/* Active Toggle */}
              <div className="flex items-center justify-between py-2 px-3 bg-[#F5F5EE] rounded-lg">
                <div>
                  <p className="text-sm font-medium text-[#155E63]">Active</p>
                  <p className="text-xs text-[#337875]">
                    Make this schedule visible on the website
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
                  ? "Update Schedule"
                  : "Create Schedule"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
