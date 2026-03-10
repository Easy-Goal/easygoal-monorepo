import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  trend?: number;
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void };
}

export function StatCard({ title, value, trend, icon, action, className, ...props }: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0;
  return (
    <div
      className={cn(
        "rounded-xl bg-[#121E34] border border-[#1E3050] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-slate-400">{title}</p>
        {icon && <div className="text-orange-400">{icon}</div>}
      </div>
      <p className="text-2xl font-bold text-white mb-2">{value}</p>
      <div className="flex items-center justify-between">
        {trend !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              isPositive ? "text-green-400" : "text-red-400"
            )}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(trend)}%
          </div>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="ml-auto flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition-colors"
          >
            {action.label} <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}
