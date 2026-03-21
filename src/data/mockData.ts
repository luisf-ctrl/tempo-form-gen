import type {
  GeneratedDocument,
  Template,
  Activity,
  FormConfig,
  ProjectStatus,
} from "@/types";

// Dashboard-only mock data (simplified, not the full Project type)
export interface DashboardProject {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  description: string;
  documentsGenerated: number;
  progress: number;
}

export const mockProjects: DashboardProject[] = [
  {
    id: "p1",
    name: "SAP S/4HANA Migration",
    client: "Müller AG",
    status: "active",
    createdAt: "2026-01-15",
    updatedAt: "2026-03-17",
    description: "Komplette S/4HANA Migration mit Customizing und Go-Live Begleitung",
    documentsGenerated: 5,
    progress: 65,
  },
  {
    id: "p2",
    name: "CRM Implementierung",
    client: "Schmidt GmbH",
    status: "active",
    createdAt: "2026-02-01",
    updatedAt: "2026-03-16",
    description: "Salesforce CRM Einführung inkl. Datenmigration",
    documentsGenerated: 3,
    progress: 40,
  },
  {
    id: "p3",
    name: "ERP Rollout APAC",
    client: "Global Corp",
    status: "draft",
    createdAt: "2026-03-10",
    updatedAt: "2026-03-10",
    description: "ERP System Rollout für die APAC-Region",
    documentsGenerated: 0,
    progress: 5,
  },
  {
    id: "p4",
    name: "BI Dashboard Projekt",
    client: "DataVision GmbH",
    status: "completed",
    createdAt: "2025-11-01",
    updatedAt: "2026-02-28",
    description: "Business Intelligence Dashboards und Reporting Suite",
    documentsGenerated: 8,
    progress: 100,
  },
];

export const mockDocuments: GeneratedDocument[] = [
  {
    id: "d1",
    name: "Kick-off Präsentation - SAP Migration",
    type: "kickoff",
    version: "1.2",
    status: "generated",
    createdAt: "2026-03-17",
    projectId: "p1",
    size: "2.4 MB",
  },
  {
    id: "d2",
    name: "Blueprint - Finanzprozesse",
    type: "blueprint",
    version: "2.0",
    status: "generated",
    createdAt: "2026-03-15",
    projectId: "p1",
    size: "5.1 MB",
  },
  {
    id: "d3",
    name: "Customizing-Anleitung MM",
    type: "customizing",
    version: "1.0",
    status: "pending",
    createdAt: "2026-03-18",
    projectId: "p1",
    size: "—",
  },
  {
    id: "d4",
    name: "Kick-off Präsentation - CRM",
    type: "kickoff",
    version: "1.0",
    status: "generated",
    createdAt: "2026-02-05",
    projectId: "p2",
    size: "1.8 MB",
  },
  {
    id: "d5",
    name: "Projektstatusbericht Q1",
    type: "report",
    version: "1.1",
    status: "generated",
    createdAt: "2026-03-14",
    projectId: "p4",
    size: "980 KB",
  },
];

export const mockTemplates: Template[] = [
  {
    id: "t1",
    name: "Kick-off Präsentation",
    type: "kickoff",
    version: "3.1",
    language: "Deutsch",
    status: "active",
    description: "Standard Kick-off Template für SAP-Projekte",
    lastUpdated: "2026-03-01",
    fields: 18,
  },
  {
    id: "t2",
    name: "Blueprint Document",
    type: "blueprint",
    version: "2.4",
    language: "Deutsch",
    status: "active",
    description: "Blueprint-Vorlage mit Prozessabschnitten und Customizing-Referenzen",
    lastUpdated: "2026-02-20",
    fields: 32,
  },
  {
    id: "t3",
    name: "Customizing Guide",
    type: "customizing",
    version: "1.8",
    language: "Deutsch",
    status: "active",
    description: "Schritt-für-Schritt Customizing-Anleitung",
    lastUpdated: "2026-02-15",
    fields: 24,
  },
  {
    id: "t4",
    name: "Kick-off Presentation (EN)",
    type: "kickoff",
    version: "3.0",
    language: "English",
    status: "active",
    description: "Standard kick-off template for international projects",
    lastUpdated: "2026-01-20",
    fields: 18,
  },
  {
    id: "t5",
    name: "Project Status Report",
    type: "report",
    version: "1.2",
    language: "Deutsch",
    status: "draft",
    description: "Vorlage für periodische Statusberichte",
    lastUpdated: "2026-03-10",
    fields: 12,
  },
  {
    id: "t6",
    name: "Go-Live Checklist",
    type: "checklist",
    version: "1.0",
    language: "Deutsch",
    status: "deprecated",
    description: "Prüfliste für Go-Live Vorbereitung (veraltet)",
    lastUpdated: "2025-09-01",
    fields: 15,
  },
];

export const mockActivities: Activity[] = [
  { id: "a1", action: "Dokument generiert", project: "SAP S/4HANA Migration", user: "Max Berger", timestamp: "Vor 2 Stunden", type: "generate" },
  { id: "a2", action: "Projekt aktualisiert", project: "CRM Implementierung", user: "Lisa Meier", timestamp: "Vor 4 Stunden", type: "update" },
  { id: "a3", action: "Blueprint heruntergeladen", project: "SAP S/4HANA Migration", user: "Thomas Kern", timestamp: "Heute, 09:15", type: "download" },
  { id: "a4", action: "Neues Projekt angelegt", project: "ERP Rollout APAC", user: "Max Berger", timestamp: "Gestern", type: "create" },
  { id: "a5", action: "Kick-off generiert", project: "CRM Implementierung", user: "Lisa Meier", timestamp: "15.03.2026", type: "generate" },
];

export const mockFormConfig: FormConfig = {
  sections: [
    { id: "general", title: "Allgemeine Projektdaten", description: "Grundlegende Informationen zum Projekt", order: 1 },
    { id: "organization", title: "Organisation / Team", description: "Projektbeteiligte und Zuständigkeiten", order: 2 },
    { id: "localization", title: "Sprache / Lokalisierung", description: "Spracheinstellungen und regionale Parameter", order: 3 },
    { id: "process", title: "Prozess- und Tool-Angaben", description: "Spezifische Prozess- und Werkzeugkonfiguration", order: 4 },
    { id: "blueprint", title: "Blueprint-Steuerparameter", description: "Zusätzliche Parameter für die Blueprint-Generierung", order: 5 },
  ],
  fields: [
    { id: "projectName", type: "text", label: "Projektname", placeholder: "z. B. SAP Migration Phase 2", required: true, section: "general", order: 1 },
    { id: "client", type: "text", label: "Kundenname", placeholder: "Name des Kunden", required: true, section: "general", order: 2 },
    { id: "startDate", type: "date", label: "Projektstart", required: true, section: "general", order: 3 },
    { id: "endDate", type: "date", label: "Projektende (geplant)", section: "general", order: 4 },
    { id: "projectType", type: "select", label: "Auftragsart", required: true, options: [
      { label: "Neuimplementierung", value: "new" },
      { label: "Migration", value: "migration" },
      { label: "Rollout", value: "rollout" },
      { label: "Optimierung", value: "optimization" },
    ], section: "general", order: 5 },
    { id: "description", type: "textarea", label: "Projektbeschreibung", placeholder: "Kurze Beschreibung des Projekts...", helpText: "Max. 500 Zeichen", section: "general", order: 6, max: 500 },
    { id: "budget", type: "number", label: "Budget (EUR)", placeholder: "z. B. 250000", section: "general", order: 7, min: 0 },

    { id: "projectLead", type: "text", label: "Projektleiter", required: true, section: "organization", order: 1 },
    { id: "consultant", type: "text", label: "Leitender Berater", section: "organization", order: 2 },
    { id: "teamSize", type: "number", label: "Teamgröße", min: 1, max: 200, section: "organization", order: 3 },
    { id: "stakeholders", type: "textarea", label: "Key Stakeholder", placeholder: "Namen und Rollen der Stakeholder", section: "organization", order: 4 },

    { id: "language", type: "select", label: "Projektsprache", required: true, options: [
      { label: "Deutsch", value: "de" },
      { label: "Englisch", value: "en" },
      { label: "Französisch", value: "fr" },
      { label: "Spanisch", value: "es" },
    ], section: "localization", order: 1 },
    { id: "regions", type: "multiselect", label: "Zielregionen", options: [
      { label: "DACH", value: "dach" },
      { label: "Nordamerika", value: "na" },
      { label: "APAC", value: "apac" },
      { label: "EMEA", value: "emea" },
      { label: "LATAM", value: "latam" },
    ], section: "localization", order: 2 },
    { id: "currency", type: "select", label: "Währung", options: [
      { label: "EUR", value: "eur" },
      { label: "USD", value: "usd" },
      { label: "GBP", value: "gbp" },
      { label: "CHF", value: "chf" },
    ], section: "localization", order: 3, dependencies: [{ field: "language", operator: "equals", value: "de" }] },

    { id: "erpSystem", type: "select", label: "ERP-System", options: [
      { label: "SAP S/4HANA", value: "s4hana" },
      { label: "SAP ECC", value: "ecc" },
      { label: "Oracle", value: "oracle" },
      { label: "Microsoft Dynamics", value: "dynamics" },
    ], section: "process", order: 1 },
    { id: "modules", type: "multiselect", label: "Betroffene Module", options: [
      { label: "FI - Finanzwesen", value: "fi" },
      { label: "CO - Controlling", value: "co" },
      { label: "MM - Materialwirtschaft", value: "mm" },
      { label: "SD - Vertrieb", value: "sd" },
      { label: "PP - Produktion", value: "pp" },
      { label: "HR - Personal", value: "hr" },
    ], section: "process", order: 2 },
    { id: "goLiveDate", type: "date", label: "Go-Live Datum", section: "process", order: 3 },
    { id: "dataPrivacy", type: "checkbox", label: "Datenschutzrelevant (DSGVO)", section: "process", order: 4 },

    { id: "blueprintScope", type: "select", label: "Blueprint-Umfang", options: [
      { label: "Vollständig", value: "full" },
      { label: "Delta / Ergänzung", value: "delta" },
      { label: "Nur Customizing", value: "customizing_only" },
    ], section: "blueprint", order: 1, dependencies: [{ field: "projectType", operator: "in", value: ["new", "migration"] }] },
    { id: "includeTestCases", type: "checkbox", label: "Testfälle einbeziehen", defaultValue: true, section: "blueprint", order: 2 },
    { id: "blueprintNotes", type: "textarea", label: "Zusätzliche Hinweise", placeholder: "Besondere Anforderungen für den Blueprint...", section: "blueprint", order: 3 },
  ],
};

// ===== Updates & Resources =====
export interface ProjectUpdate {
  id: string;
  date: string;
  topic: string;
  author: string;
}

export const mockUpdates: ProjectUpdate[] = [
  { id: "u1", date: "20.03.2026", topic: "Blueprint-Generator: Neues Template-System live", author: "Max Berger" },
  { id: "u2", date: "18.03.2026", topic: "SAP S/4HANA Migration: Go-Live Termin bestätigt", author: "Thomas Kern" },
  { id: "u3", date: "15.03.2026", topic: "CRM: Datenmigration Phase 2 abgeschlossen", author: "Lisa Meier" },
  { id: "u4", date: "12.03.2026", topic: "Architekturentscheidung: Cloud-First Strategie", author: "Max Berger" },
  { id: "u5", date: "10.03.2026", topic: "Neuer Prozess PBM3000 Inventur dokumentiert", author: "Thomas Kern" },
];

export interface ProjectLink {
  id: string;
  tool: string;
  url: string;
}

export const mockProjectLinks: ProjectLink[] = [
  { id: "l1", tool: "Ticketsystem / Task Board", url: "https://jira.example.com/projects/SAP" },
  { id: "l2", tool: "Projektsystem DEV", url: "https://dev.sap.example.com" },
  { id: "l3", tool: "Projektsystem PROD", url: "https://prod.sap.example.com" },
  { id: "l4", tool: "Dokumentenablage (SharePoint)", url: "https://sharepoint.example.com/projects" },
];

export interface BlogPost {
  id: string;
  title: string;
  category: "documentation" | "architecture" | "lessons" | "update";
  excerpt: string;
  author: string;
  date: string;
}

export const mockBlogPosts: BlogPost[] = [
  { id: "b1", title: "Cloud-First Architekturentscheidung", category: "architecture", excerpt: "Warum wir uns für eine Cloud-native Architektur entschieden haben und welche Auswirkungen das auf das Projekt hat.", author: "Max Berger", date: "18.03.2026" },
  { id: "b2", title: "Lessons Learned: Datenmigration Phase 1", category: "lessons", excerpt: "Wichtige Erkenntnisse aus der ersten Migrationsphase und Empfehlungen für Phase 2.", author: "Lisa Meier", date: "14.03.2026" },
  { id: "b3", title: "Blueprint-Parametrisierung: Best Practices", category: "documentation", excerpt: "Anleitung zur optimalen Nutzung des Blueprint-Generators mit Praxisbeispielen.", author: "Thomas Kern", date: "10.03.2026" },
  { id: "b4", title: "SAP Integration: RFC vs. OData Vergleich", category: "architecture", excerpt: "Technischer Vergleich der Integrationsoptionen für die SAP-Anbindung.", author: "Max Berger", date: "05.03.2026" },
];

export const blogCategoryLabels: Record<string, string> = {
  documentation: "Dokumentation",
  architecture: "Architektur",
  lessons: "Lessons Learned",
  update: "Projektupdates",
};

export const documentTypeLabels: Record<string, string> = {
  kickoff: "Kick-off Präsentation",
  blueprint: "Blueprint",
  customizing: "Customizing-Anleitung",
  report: "Statusbericht",
  checklist: "Checkliste",
};

export const statusLabels: Record<string, string> = {
  active: "Aktiv",
  completed: "Abgeschlossen",
  draft: "Entwurf",
  archived: "Archiviert",
  generated: "Generiert",
  pending: "In Bearbeitung",
  error: "Fehler",
  deprecated: "Veraltet",
};
