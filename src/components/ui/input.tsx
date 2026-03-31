import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "#/lib/utils"

const inputVariants = cva(
  "w-full min-w-0 rounded-xl border bg-transparent px-4 shadow-sm transition-all outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      inputSize: {
        default:
          "h-9 text-base",
        lg:
          "h-12 text-base",
        sm:
          "h-8 text-sm px-3",
      },
      tone: {
        default:
          "border-input bg-transparent focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
        form:
          "bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-blue-500/50 hover:border-blue-300 dark:hover:border-blue-700 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
      },
    },
    defaultVariants: {
      inputSize: "lg",
      tone: "form",
    },
  }
)

function Input({
  className,
  type,
  inputSize,
  tone,
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ inputSize, tone, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
