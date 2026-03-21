import { cn } from "@/lib/utils";

type StatusVariant = "active" | "completed" | "draft" | "archived" | "generated" | "pending" | "error" | "deprecated";

const variantStyles: Record<StatusVariant, string> = {
  active: "bg-foreground text-background",
  completed: "bg-success/10 text-success",
  draft: "bg-secondary text-muted-foreground",
  archived: "bg-secondary text-muted-foreground",
  generated: "bg-foreground text-background",
  pending: "bg-warning/10 text-warning",
  error: "bg-destructive/10 text-destructive",
  deprecated: "bg-secondary text-muted-foreground",
};

const labels: Record<StatusVariant, string> = {
  active: "Aktiv",
  completed: "Abgeschlossen",
  draft: "Entwurf",
  archived: "Archiviert",
  generated: "Generiert",
  pending: "In Bearbeitung",
  error: "Fehler",
  deprecated: "Veraltet",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = status as StatusVariant;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider",
        variantStyles[variant] || variantStyles.draft,
        className
      )}
    >
      {labels[variant] || status}
    </span>
  );
}
