import type { ChecklistItem, DocumentTemplateType } from "@/types";

interface ChecklistTemplate {
  label: string;
  category: ChecklistItem["category"];
  linkedDocumentType?: DocumentTemplateType;
}

const checklistTemplates: ChecklistTemplate[] = [
  // Prepare
  { label: "Kick-Off Präsentation erstellen", category: "prepare", linkedDocumentType: "kickoff" },
  { label: "Projektplan & Meilensteine definieren", category: "prepare", linkedDocumentType: "projektplan" },
  { label: "Workshop-Agenda vorbereiten", category: "prepare", linkedDocumentType: "workshop_plan" },
  { label: "Projekt-Team zusammenstellen", category: "prepare" },
  { label: "Systemzugänge einrichten", category: "prepare" },
  { label: "Azure DevOps Board aufsetzen", category: "prepare", linkedDocumentType: "azure_devops_doku" },
  { label: "Kick-Off Meeting durchführen", category: "prepare" },

  // Explore
  { label: "Blueprint erstellen", category: "explore", linkedDocumentType: "blueprint" },
  { label: "Ist-Analyse durchführen", category: "explore" },
  { label: "Soll-Prozesse dokumentieren", category: "explore" },
  { label: "Fit-Gap-Analyse abschließen", category: "explore" },
  { label: "Customizing Plan erstellen", category: "explore", linkedDocumentType: "customizing_plan" },
  { label: "Workshops durchführen", category: "explore" },
  { label: "Blueprint Review & Abnahme", category: "explore" },

  // Realize
  { label: "Customizing umsetzen", category: "realize" },
  { label: "Testmanagement aufsetzen", category: "realize", linkedDocumentType: "testmanagement" },
  { label: "Unit Tests durchführen", category: "realize" },
  { label: "Integrationstests durchführen", category: "realize" },
  { label: "Key User Schulung planen", category: "realize" },
  { label: "Datenmigration vorbereiten", category: "realize" },
  { label: "Schnittstellen testen", category: "realize" },

  // Deploy
  { label: "GoLive Planung erstellen", category: "deploy", linkedDocumentType: "golive_planning" },
  { label: "Cutover-Checkliste abarbeiten", category: "deploy" },
  { label: "User Acceptance Test durchführen", category: "deploy" },
  { label: "End-User Schulung durchführen", category: "deploy" },
  { label: "Go-Live Readiness Check", category: "deploy" },
  { label: "Go-Live durchführen", category: "deploy" },
  { label: "Abnahmeprotokoll erstellen", category: "deploy" },

  // Run
  { label: "Hypercare-Phase starten", category: "run" },
  { label: "Monitoring & Support sicherstellen", category: "run" },
  { label: "Lessons Learned dokumentieren", category: "run" },
  { label: "Projektabschluss & Übergabe", category: "run" },
  { label: "Abschlussbericht erstellen", category: "run" },
];

export function generateChecklist(): ChecklistItem[] {
  return checklistTemplates.map((tpl, idx) => ({
    id: `chk-${idx + 1}`,
    label: tpl.label,
    category: tpl.category,
    completed: false,
    linkedDocumentType: tpl.linkedDocumentType,
  }));
}

export const categoryLabels: Record<ChecklistItem["category"], string> = {
  prepare: "Prepare",
  explore: "Explore",
  realize: "Realize",
  deploy: "Deploy / Go-Live",
  run: "Run / Hypercare",
};

export const categoryColors: Record<ChecklistItem["category"], string> = {
  prepare: "bg-blue-100 text-blue-700",
  explore: "bg-purple-100 text-purple-700",
  realize: "bg-amber-100 text-amber-700",
  deploy: "bg-emerald-100 text-emerald-700",
  run: "bg-slate-100 text-slate-700",
};
