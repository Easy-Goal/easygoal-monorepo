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
        "rounded-xl bg-[#121E34] border border-[#1E3050] p-4 transition-all duration-200 hover:border-orange-500/20",
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
          <p className="text-xs text-slate-400">{title}</p>
          <p className="text-xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
