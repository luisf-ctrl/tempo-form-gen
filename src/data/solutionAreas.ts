import type { SolutionArea } from "@/types";
import { Boxes, Wrench, Zap, ClipboardCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SolutionAreaConfig {
  id: SolutionArea;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export const solutionAreas: SolutionAreaConfig[] = [
  {
    id: "material_management",
    label: "Material Management",
    description: "Lagerverwaltung, Warenein-/ausgang, Inventur und Materialwirtschaft",
    icon: Boxes,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "maintenance_os",
    label: "Maintenance OS",
    description: "Instandhaltung, Arbeitsaufträge, Inspektionen und Wartungsplanung",
    icon: Wrench,
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: "utilities_management",
    label: "Utilities Management",
    description: "Versorgungsunternehmen, Zählerwesen und Netzmanagement",
    icon: Zap,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "audit",
    label: "Audit",
    description: "Revision, Compliance-Prüfungen und Audit-Dokumentation",
    icon: ClipboardCheck,
    color: "bg-purple-100 text-purple-600",
  },
];

export const solutionAreaLabels: Record<SolutionArea, string> = {
  material_management: "Material Management",
  maintenance_os: "Maintenance OS",
  utilities_management: "Utilities Management",
  audit: "Audit",
};
