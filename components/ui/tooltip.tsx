import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

type TooltipContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null)

const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

type TooltipProps = {
  children: React.ReactNode
  defaultOpen?: boolean
}

const Tooltip = ({ children, defaultOpen = false }: TooltipProps) => {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <span
        className="relative inline-flex"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </span>
    </TooltipContext.Provider>
  )
}

type TooltipTriggerProps = React.HTMLAttributes<HTMLElement> & {
  asChild?: boolean
}

const TooltipTrigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "span"
    return (
      <Comp ref={ref} className={cn("inline-flex", className)} {...props} />
    )
  }
)
TooltipTrigger.displayName = "TooltipTrigger"

type TooltipContentProps = React.HTMLAttributes<HTMLDivElement> & {
  sideOffset?: number
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, sideOffset = 4, style, ...props }, ref) => {
    const context = React.useContext(TooltipContext)
    if (!context) {
      throw new Error("TooltipContent must be used within Tooltip")
    }

    return (
      <div
        ref={ref}
        role="tooltip"
        data-state={context.open ? "open" : "closed"}
        style={{
          marginTop: sideOffset,
          ...style,
        }}
        className={cn(
          "absolute left-1/2 top-full z-50 w-max -translate-x-1/2 rounded-md border border-border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
          "transition-opacity",
          context.open ? "opacity-100" : "pointer-events-none opacity-0",
          className
        )}
        {...props}
      />
    )
  }
)
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
