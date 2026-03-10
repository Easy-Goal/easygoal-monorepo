import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "inline" | "page";
  text?: string;
}

export function LoadingState({ variant = "inline", text, className, ...props }: LoadingStateProps) {
  if (variant === "page") {
    return (
      <div
        className={cn("flex min-h-[400px] flex-col items-center justify-center gap-3", className)}
        {...props}
      >
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        {text && <p className="text-sm text-slate-400">{text}</p>}
      </div>
    );
  }
  return (
    <div className={cn("flex items-center gap-2 text-slate-400", className)} {...props}>
      <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
      {text && <span className="text-sm">{text}</span>}
    </div>
  );
}
