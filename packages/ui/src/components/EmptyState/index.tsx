import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const emptyVariants = cva("flex flex-col items-center justify-center text-center", {
  variants: {
    variant: {
      inline: "py-8 gap-2",
      dashed:
        "rounded-xl border-2 border-dashed border-[#1E3050] py-12 gap-3 hover:border-orange-500/30 transition-colors",
      card: "rounded-xl bg-[#121E34] border border-[#1E3050] py-12 gap-3",
    },
  },
  defaultVariants: { variant: "inline" },
});

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyVariants> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  className,
  variant,
  icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div className={cn(emptyVariants({ variant }), className)} {...props}>
      {icon && <div className="text-slate-500 mb-1">{icon}</div>}
      <p className="font-medium text-white">{title}</p>
      {description && <p className="text-sm text-slate-400 max-w-xs">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
