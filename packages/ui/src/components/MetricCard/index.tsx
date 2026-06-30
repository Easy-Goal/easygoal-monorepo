import { cn } from "../../lib/utils";

interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
}

export function MetricCard({ title, value, icon, subtitle, className, ...props }: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-card border border-border p-4 transition-all duration-200 hover:border-accent/20",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
            {icon}
          </div>
        )}
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
