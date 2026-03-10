import { Info, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const alertVariants = cva("flex gap-3 rounded-xl border p-4", {
  variants: {
    variant: {
      info: "border-blue-500/30 bg-blue-500/10 text-blue-300",
      warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
      error: "border-red-500/30 bg-red-500/10 text-red-300",
      success: "border-green-500/30 bg-green-500/10 text-green-300",
    },
  },
  defaultVariants: { variant: "info" },
});

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  success: CheckCircle,
} as const;

export interface AlertBoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
}

export function AlertBox({ className, variant = "info", title, children, ...props }: AlertBoxProps) {
  const Icon = iconMap[variant!];
  return (
    <div className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex flex-col gap-1">
        {title && <p className="font-medium text-sm">{title}</p>}
        {children && <div className="text-sm opacity-80">{children}</div>}
      </div>
    </div>
  );
}
