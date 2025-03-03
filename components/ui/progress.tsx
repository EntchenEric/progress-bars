"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  color,
  backgroundColor,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  color?: string
  backgroundColor?: string
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      style={{ backgroundColor: backgroundColor }}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 transition-all",
          !color && "bg-primary",
        )}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          backgroundColor: color,
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
