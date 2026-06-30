import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface QuickLinkCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  href?: string;
}

export function QuickLinkCard({ title, description, icon, href, className, onClick, ...props }: QuickLinkCardProps) {
  const inner = (
    <>
      {icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{title}</p>
        {description && <p className="text-sm text-muted-foreground truncate">{description}</p>}
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
    </>
  );

  const baseClass = cn(
    "group flex items-center gap-4 rounded-xl bg-card border border-border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 cursor-pointer",
    className
  );

  if (href) {
    return (
      <a href={href} className={baseClass}>
        {inner}
      </a>
    );
  }

  return (
    <div className={baseClass} onClick={onClick} {...props}>
      {inner}
    </div>
  );
}
