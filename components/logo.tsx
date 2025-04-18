import { Radio, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = {
    sm: {
      container: "h-5 w-5",
      outer: "h-5 w-5",
      inner: "h-2.5 w-2.5",
      text: "text-base",
    },
    md: {
      container: "h-6 w-6",
      outer: "h-6 w-6",
      inner: "h-3 w-3",
      text: "text-xl",
    },
    lg: {
      container: "h-8 w-8",
      outer: "h-8 w-8",
      inner: "h-4 w-4",
      text: "text-2xl",
    },
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative flex items-center justify-center", sizes[size].container)}>
        <Radio className={cn("text-primary absolute", sizes[size].outer)} />
        <Zap className={cn("text-primary-foreground absolute", sizes[size].inner)} />
      </div>
      {showText && <span className={cn("font-bold text-primary", sizes[size].text)}>CreatorAmp</span>}
    </div>
  )
}
