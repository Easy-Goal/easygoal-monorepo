// Header components
export { EasyHeader, NotificationBell, UserMenu, RankBadge, RANK_CONFIG } from "./components/Header";
export type { EasyHeaderProps, HeaderNavLink, HeaderUser, HeaderNotification } from "./components/Header";

// Logo
export { Logo } from "./components/Logo";

// Tier 1 — Primitivos
export { Button, buttonVariants } from "./components/Button";
export type { ButtonProps } from "./components/Button";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./components/Card";
export { Badge, badgeVariants } from "./components/Badge";
export type { BadgeProps } from "./components/Badge";
export { Skeleton } from "./components/Skeleton";
export { Avatar } from "./components/Avatar";
export { Input, Textarea } from "./components/Input";
export type { InputProps, TextareaProps } from "./components/Input";

// Tier 2 — Feedback & Estado
export { AlertBox } from "./components/AlertBox";
export type { AlertBoxProps } from "./components/AlertBox";
export { EmptyState } from "./components/EmptyState";
export type { EmptyStateProps } from "./components/EmptyState";
export { LoadingState } from "./components/LoadingState";

// Tier 3 — Data Display
export { StatCard } from "./components/StatCard";
export { MetricCard } from "./components/MetricCard";
export { QuickLinkCard } from "./components/QuickLinkCard";

// Tokens
export { colors, cssVars, animations, keyframes } from "./tokens";
export type { ColorToken } from "./tokens";

// Utils
export { cn } from "./lib/utils";
