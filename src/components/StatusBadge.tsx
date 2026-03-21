import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusVariant = "active" | "completed" | "draft" | "archived" | "generated" | "pending" | "error" | "deprecated";

const variantStyles: Record<StatusVariant, string> = {
  active: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-success/10 text-success border-success/20",
  draft: "bg-muted text-muted-foreground border-border",
  archived: "bg-muted text-muted-foreground border-border",
  generated: "bg-primary/10 text-primary border-primary/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  error: "bg-destructive/10 text-destructive border-destructive/20",
  deprecated: "bg-muted text-muted-foreground border-border",
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
    <Badge
      variant="outline"
      className={cn(
        "font-medium text-xs",
        variantStyles[variant] || variantStyles.draft,
        className
      )}
    >
      {labels[variant] || status}
    </Badge>
  );
}
