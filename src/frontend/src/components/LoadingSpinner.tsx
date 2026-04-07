import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
  fullPage?: boolean;
}

export function LoadingSpinner({
  size = "md",
  className,
  label,
  fullPage,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  const spinner = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-primary/20 border-t-primary",
          sizeClasses[size],
        )}
        role="status"
        aria-label={label ?? "Loading"}
      />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export default LoadingSpinner;
