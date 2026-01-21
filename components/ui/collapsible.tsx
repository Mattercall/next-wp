import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

type CollapsibleContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(
  null
)

type CollapsibleProps = React.HTMLAttributes<HTMLDivElement> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  asChild?: boolean
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    {
      className,
      defaultOpen = false,
      open: openProp,
      onOpenChange,
      asChild,
      children,
      ...props
    },
    ref
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
    const isControlled = openProp !== undefined
    const open = isControlled ? openProp : uncontrolledOpen

    const setOpen = React.useCallback(
      (nextOpen: boolean) => {
        if (!isControlled) {
          setUncontrolledOpen(nextOpen)
        }
        onOpenChange?.(nextOpen)
      },
      [isControlled, onOpenChange]
    )

    const Comp = asChild ? Slot : "div"

    return (
      <CollapsibleContext.Provider value={{ open, setOpen }}>
        <Comp
          ref={ref}
          data-state={open ? "open" : "closed"}
          className={cn(className)}
          {...props}
        >
          {children}
        </Comp>
      </CollapsibleContext.Provider>
    )
  }
)
Collapsible.displayName = "Collapsible"

type CollapsibleTriggerProps = React.HTMLAttributes<HTMLElement> & {
  asChild?: boolean
}

const CollapsibleTrigger = React.forwardRef<HTMLElement, CollapsibleTriggerProps>(
  ({ className, asChild, onClick, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext)
    if (!context) {
      throw new Error("CollapsibleTrigger must be used within Collapsible")
    }

    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        data-state={context.open ? "open" : "closed"}
        className={cn(className)}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          onClick?.(event)
          context.setOpen(!context.open)
        }}
        {...props}
      />
    )
  }
)
CollapsibleTrigger.displayName = "CollapsibleTrigger"

type CollapsibleContentProps = React.HTMLAttributes<HTMLDivElement>

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  CollapsibleContentProps
>(({ className, hidden, ...props }, ref) => {
  const context = React.useContext(CollapsibleContext)
  if (!context) {
    throw new Error("CollapsibleContent must be used within Collapsible")
  }

  return (
    <div
      ref={ref}
      data-state={context.open ? "open" : "closed"}
      hidden={hidden ?? !context.open}
      className={cn(className)}
      {...props}
    />
  )
})
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
