import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("space-y-2", className)} {...props} />
)

const AccordionItem = React.forwardRef<
  HTMLDetailsElement,
  React.DetailsHTMLAttributes<HTMLDetailsElement>
>(({ className, ...props }, ref) => (
  <details ref={ref} className={cn("group border-b border-border", className)} {...props} />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => (
  <summary
    ref={ref as React.Ref<HTMLSummaryElement>}
    className={cn(
      "flex cursor-pointer list-none items-center justify-between py-4 text-sm font-medium transition-all hover:underline",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180" />
  </summary>
))
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pb-4 pt-0 text-sm", className)} {...props} />
))
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
