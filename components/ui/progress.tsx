"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  color,
  animated = false,
  striped = false,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  color?: string
  animated?: boolean
  striped?: boolean
}) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700",
        className
      )}
      style={{ 
        transition: "all 0.3s ease"
      }}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1",
          !color && "bg-primary",
          striped && mounted && "progress-striped",
          animated && mounted && "progress-animated",
        )}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          backgroundColor: color || "#2563eb",
          transition: "transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)",
          backgroundSize: striped ? "1rem 1rem" : undefined,
          backgroundImage: striped 
            ? `linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent)` 
            : undefined,
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
