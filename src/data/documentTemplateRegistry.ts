import type { DocumentTemplate, DocumentTemplateType } from "@/types";

export const documentTemplates: DocumentTemplate[] = [
  {
    id: "tpl-kickoff",
    type: "kickoff",
    label: "Kick-Off Präsentation",
    labelEn: "Kick-Off Presentation",
    description: "Projekt-Kickoff Präsentation mit Agenda, Zielen und Meilensteinen",
    format: "pptx",
    templateFiles: { de: "KickOff_Template_de.pptx", en: "KickOff_Template_en.pptx" },
    applicableAreas: ["material_management", "maintenance_os", "utilities_management", "audit"],
  },
  {
    id: "tpl-blueprint",
    type: "blueprint",
    label: "Blueprint",
    labelEn: "Blueprint",
    description: "Business Blueprint mit Prozessdokumentation und Customizing-Referenzen",
    format: "docx",
    templateFiles: { de: "Blueprint_Template_de_mm.docx", en: "Blueprint_Template_en_mm.docx" },
    applicableAreas: ["material_management", "maintenance_os", "utilities_management", "audit"],
  },
  {
    id: "tpl-projektplan",
    type: "projektplan",
    label: "Projektplan + Milestones",
    labelEn: "Project Plan + Milestones",
    description: "Projektplan mit Meilenstein-Berechnung und Phasenübersicht",
    format: "xlsx",
    templateFiles: { de: "Projektplan_Template_de.xlsx", en: "Projektplan_Template_en.xlsx" },
    applicableAreas: ["material_management", "maintenance_os", "utilities_management", "audit"],
  },
  {
    id: "tpl-customizing-plan",
    type: "customizing_plan",
    label: "Customizing Plan",
    labelEn: "Customizing Plan",
    description: "Customizing-Anleitung mit Schritt-für-Schritt-Konfiguration",
    format: "docx",
    templateFiles: { de: "Customizing_Plan_de.docx", en: "Customizing_Plan_en.docx" },
    applicableAreas: ["material_management", "maintenance_os", "utilities_management", "audit"],
  },
  {
    id: "tpl-golive",
    type: "golive_planning",
    label: "GoLive Planung + Cutover + Abnahme",
    labelEn: "GoLive Planning + Cutover + Acceptance",
    description: "Go-Live Planung, Cutover-Checkliste und Abnahmeprotokoll",
    format: "docx",
    templateFiles: { de: "GoLive_Template_de.docx", en: "GoLive_Template_en.docx" },
    applicableAreas: ["material_management", "maintenance_os", "utilities_management", "audit"],
  },
  {
    id: "tpl-workshop",
    type: "workshop_plan",
    label: "Workshop Plan + Agenda",
    labelEn: "Workshop Plan + Agenda",
    description: "Workshop-Planung mit Agenda, Teilnehmerliste und Ergebnisprotokoll",
    format: "pptx",
    templateFiles: { de: "Workshop_Template_de.pptx", en: "Workshop_Template_en.pptx" },
    applicableAreas: ["material_management", "maintenance_os", "utilities_management", "audit"],
  },
  {
    id: "tpl-testmanagement",
    type: "testmanagement",
    label: "Testmanagement",
    labelEn: "Test Management",
    description: "Testmanagement mit Testfällen, Testprotokollen und Fehlerverfolgung",
    format: "xlsx",
    templateFiles: { de: "Testmanagement_Template_de.xlsx", en: "Testmanagement_Template_en.xlsx" },
    applicableAreas: ["material_management", "maintenance_os", "utilities_management", "audit"],
  },
  {
    id: "tpl-azure-devops",
    type: "azure_devops_doku",
    label: "Azure DevOps Doku",
    labelEn: "Azure DevOps Documentation",
    description: "Azure DevOps Dokumentation mit Board-Struktur und Pipeline-Konfiguration",
    format: "pptx",
    templateFiles: { de: "AzureDevOps_Template_de.pptx", en: "AzureDevOps_Template_en.pptx" },
    applicableAreas: ["material_management", "maintenance_os", "utilities_management", "audit"],
  },
];

export function getTemplatesForArea(area: string): DocumentTemplate[] {
  return documentTemplates.filter((t) => t.applicableAreas.includes(area as any));
}

export function getTemplateByType(type: DocumentTemplateType): DocumentTemplate | undefined {
  return documentTemplates.find((t) => t.type === type);
}

export const documentTypeLabels: Record<string, string> = {
  kickoff: "Kick-Off Präsentation",
  blueprint: "Blueprint",
  projektplan: "Projektplan + Milestones",
  customizing_plan: "Customizing Plan",
  golive_planning: "GoLive + Cutover + Abnahme",
  workshop_plan: "Workshop Plan + Agenda",
  testmanagement: "Testmanagement",
  azure_devops_doku: "Azure DevOps Doku",
  // Legacy
  customizing: "Customizing-Anleitung",
  report: "Statusbericht",
  checklist: "Checkliste",
};

export const formatLabels: Record<string, string> = {
  docx: "Word",
  pptx: "PowerPoint",
  xlsx: "Excel",
};

export const formatColors: Record<string, string> = {
  docx: "bg-blue-100 text-blue-700",
  pptx: "bg-orange-100 text-orange-700",
  xlsx: "bg-green-100 text-green-700",
};
