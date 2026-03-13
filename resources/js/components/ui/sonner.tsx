import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl font-medium",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group-[.toaster]:bg-emerald-500/15 group-[.toaster]:text-emerald-600 group-[.toaster]:border-emerald-500/20 dark:group-[.toaster]:bg-emerald-500/10 dark:group-[.toaster]:text-emerald-400 dark:group-[.toaster]:border-emerald-500/20",
          error:
            "group-[.toaster]:bg-rose-500/15 group-[.toaster]:text-rose-600 group-[.toaster]:border-rose-500/20 dark:group-[.toaster]:bg-rose-500/10 dark:group-[.toaster]:text-rose-400 dark:group-[.toaster]:border-rose-500/20",
          info: 
            "group-[.toaster]:bg-blue-500/15 group-[.toaster]:text-blue-600 group-[.toaster]:border-blue-500/20 dark:group-[.toaster]:bg-blue-500/10 dark:group-[.toaster]:text-blue-400 dark:group-[.toaster]:border-blue-500/20",
          warning:
            "group-[.toaster]:bg-amber-500/15 group-[.toaster]:text-amber-600 group-[.toaster]:border-amber-500/20 dark:group-[.toaster]:bg-amber-500/10 dark:group-[.toaster]:text-amber-400 dark:group-[.toaster]:border-amber-500/20",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-5 text-emerald-500" />,
        info: <InfoIcon className="size-5 text-blue-500" />,
        warning: <TriangleAlertIcon className="size-5 text-amber-500" />,
        error: <OctagonXIcon className="size-5 text-rose-500" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      {...props}
    />
  )
}

export { Toaster }
