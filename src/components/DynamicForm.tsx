import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, X } from "lucide-react";
import type { FormConfig, FormField, FieldDependency } from "@/types";
import { cn } from "@/lib/utils";

interface DynamicFormProps {
  config: FormConfig;
  values: Record<string, any>;
  onChange: (id: string, value: any) => void;
  errors?: Record<string, string>;
}

function evaluateDependency(dep: FieldDependency, values: Record<string, any>): boolean {
  const val = values[dep.field];
  switch (dep.operator) {
    case "equals": return val === dep.value;
    case "not_equals": return val !== dep.value;
    case "contains": return typeof val === "string" && val.includes(dep.value as string);
    case "in": return Array.isArray(dep.value) && dep.value.includes(val);
    default: return true;
  }
}

function isFieldVisible(field: FormField, values: Record<string, any>): boolean {
  if (!field.dependencies || field.dependencies.length === 0) return true;
  return field.dependencies.every((dep) => evaluateDependency(dep, values));
}

function FieldRenderer({ field, value, onChange, error }: {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}) {
  if (field.type === "heading") return null;

  const renderInput = () => {
    switch (field.type) {
      case "text":
        return (
          <Input
            id={field.id}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-xl border-border bg-secondary/30 focus:bg-card transition-colors h-11"
          />
        );
      case "textarea":
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            maxLength={field.max}
            rows={3}
            className="rounded-xl border-border bg-secondary/30 focus:bg-card transition-colors"
          />
        );
      case "number":
        return (
          <Input
            id={field.id}
            type="number"
            placeholder={field.placeholder}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
            min={field.min}
            max={field.max}
            className="rounded-xl border-border bg-secondary/30 focus:bg-card transition-colors h-11"
          />
        );
      case "date":
        return (
          <Input
            id={field.id}
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-xl border-border bg-secondary/30 focus:bg-card transition-colors h-11"
          />
        );
      case "select":
        return (
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger id={field.id} className="rounded-xl border-border bg-secondary/30 h-11">
              <SelectValue placeholder="Bitte wählen..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "multiselect": {
        const selected: string[] = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5 min-h-[2rem]">
              {selected.map((v) => {
                const opt = field.options?.find((o) => o.value === v);
                return (
                  <Badge key={v} variant="secondary" className="gap-1 pr-1 rounded-lg">
                    {opt?.label || v}
                    <button type="button" onClick={() => onChange(selected.filter((s) => s !== v))} className="hover:bg-foreground/10 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
            <Select value="" onValueChange={(v) => { if (!selected.includes(v)) onChange([...selected, v]); }}>
              <SelectTrigger className="rounded-xl border-border bg-secondary/30 h-11">
                <SelectValue placeholder="Auswahl hinzufügen..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {field.options?.filter((o) => !selected.includes(o.value)).map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      }
      case "checkbox":
        return (
          <button
            type="button"
            onClick={() => onChange(!value)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all",
              value
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-secondary/30 text-foreground hover:bg-secondary/50"
            )}
          >
            <div className={cn(
              "flex h-5 w-5 items-center justify-center rounded-md border-2 text-xs shrink-0 transition-colors",
              value ? "border-primary-foreground bg-primary-foreground text-primary" : "border-muted-foreground/40"
            )}>
              {value && "✓"}
            </div>
            <span className="text-sm font-medium">{field.label}</span>
          </button>
        );
      default:
        return <Input value={value || ""} onChange={(e) => onChange(e.target.value)} className="rounded-xl h-11" />;
    }
  };

  return (
    <div className={cn("space-y-2", field.type === "checkbox" && "pt-0")}>
      {field.type !== "checkbox" && (
        <div className="flex items-center gap-1.5">
          <Label htmlFor={field.id} className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-destructive ml-0.5">*</span>}
          </Label>
          {field.helpText && (
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="rounded-xl">
                <p className="text-xs">{field.helpText}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )}
      {renderInput()}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function DynamicForm({ config, values, onChange, errors }: DynamicFormProps) {
  const sortedSections = useMemo(
    () => [...config.sections].sort((a, b) => a.order - b.order),
    [config.sections]
  );

  return (
    <div className="space-y-8">
      {sortedSections.map((section) => {
        const sectionFields = config.fields
          .filter((f) => f.section === section.id)
          .sort((a, b) => a.order - b.order)
          .filter((f) => isFieldVisible(f, values));

        if (sectionFields.length === 0) return null;

        return (
          <div key={section.id} className="space-y-5">
            <div className="pb-2">
              <h3 className="font-heading font-semibold text-base">{section.title}</h3>
              {section.description && (
                <p className="text-sm text-muted-foreground mt-0.5">{section.description}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sectionFields.map((field) => (
                <div
                  key={field.id}
                  className={cn(
                    (field.type === "textarea" || field.type === "multiselect") && "md:col-span-2",
                    field.type === "checkbox" && "md:col-span-1"
                  )}
                >
                  <FieldRenderer
                    field={field}
                    value={values[field.id]}
                    onChange={(v) => onChange(field.id, v)}
                    error={errors?.[field.id]}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
