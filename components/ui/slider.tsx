"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, onValueChange, value, min, max, step, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    value={value}
    onValueChange={onValueChange}
    min={min}
    max={max}
    step={step}
    {...props}
  >
    <input
      type="range"
      className="sr-only"
      min={min}
      max={max}
      step={step}
      value={value?.[0]}
      onChange={(e) => onValueChange?.([Number(e.target.value)])}
      data-testid="slider-input"
    />
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-blue-500 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-blue-400 dark:bg-gray-950 dark:ring-offset-gray-950 dark:focus-visible:ring-blue-800" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider } 