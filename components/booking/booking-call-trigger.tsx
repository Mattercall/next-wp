"use client";

import { useRef } from "react";
import { useBookingModal } from "@/components/booking/booking-modal-provider";
import { cn } from "@/lib/utils";

interface BookingCallTriggerProps {
  className?: string;
  children?: React.ReactNode;
}

export function BookingCallTrigger({
  className,
  children = "Book a growth call",
}: BookingCallTriggerProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const { openBookingModal } = useBookingModal();

  return (
    <button
      ref={triggerRef}
      type="button"
      className={cn(className)}
      onClick={() => openBookingModal(triggerRef.current)}
    >
      {children}
    </button>
  );
}
