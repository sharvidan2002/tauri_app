import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden btn-modern",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground hover:shadow-glow hover:from-blue-600 hover:to-purple-700",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-destructive-foreground hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:from-red-600 hover:to-red-700",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:shadow-soft",
        secondary:
          "bg-gradient-to-r from-gray-100 to-gray-200 text-secondary-foreground hover:shadow-soft hover:from-gray-200 hover:to-gray-300",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success:
          "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:from-green-600 hover:to-emerald-700",
        warning:
          "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:from-yellow-600 hover:to-orange-600",
        glass:
          "bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 hover:shadow-glow",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8",
        xl: "h-14 rounded-2xl px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
        {/* Shimmer effect */}
        <div className="absolute inset-0 -top-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 hover:animate-shimmer hover:opacity-100" />
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }