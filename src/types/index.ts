// ===== Form Engine Types =====
export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "multiselect"
  | "checkbox"
  | "heading";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldDependency {
  field: string;
  operator: "equals" | "not_equals" | "contains" | "in";
  value: string | string[] | boolean;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  options?: FieldOption[];
  defaultValue?: string | string[] | boolean;
  dependencies?: FieldDependency[];
  section: string;
  order: number;
  min?: number;
  max?: number;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  order: number;
}

export interface FormConfig {
  sections: FormSection[];
  fields: FormField[];
}

// ===== Solution Area =====
export type SolutionArea = "material_management" | "maintenance_os" | "utilities_management" | "audit";

// ===== Project Parameters (8 Categories) =====
export interface Projektdaten {
  name: string;
  kuerzel: string;
  beschreibung: string;
  typ: string; // Neuimplementierung, Migration, Rollout, Optimierung
}

export interface Organisationen {
  auftraggeber: string;
  implementierungspartner: string;
  dienstleister: string;
  kundePartner: string;
}

export interface Systemlandschaft {
  systemA: string;
  systemB: string;
  altsystem: string;
  modulA: string;
  modulB: string;
  standortWerk: string;
}

export interface Schluesseltermine {
  projektstart: string;
  endePrepare: string;
  endeExplore: string;
  endeRealize: string;
  goLive: string;
  endeHypercare: string;
  projektende: string;
}

export interface Schluesselrollen {
  plAG: string;
  plSI: string;
  itLeitung: string;
  sponsor: string;
  cutoverManager: string;
  testManager: string;
  changeManager: string;
  streamLeadA: string;
  streamLeadB: string;
  keyUserModulA: string;
  keyUserModulB: string;
}

export interface Finanzen {
  tagessatzSenior: number | "";
  tagessatzJunior: number | "";
  reisekostenfaktor: number | "";
  gesamtbudget: number | "";
  atMonat: number | "";
}

export interface Tooling {
  serviceDeskUrl: string;
  wikiUrl: string;
  emailSupport: string;
  emailPrioritaet: string;
  emailCR: string;
}

export interface Kontaktdaten {
  ansprechpartnerAG: string;
  ansprechpartnerAGEmail: string;
  ansprechpartnerSI: string;
  ansprechpartnerSIEmail: string;
  eskalationskontakt: string;
  eskalationskontaktEmail: string;
}

export interface ProjectParameters {
  projektdaten: Projektdaten;
  organisationen: Organisationen;
  systemlandschaft: Systemlandschaft;
  schluesseltermine: Schluesseltermine;
  schluesselrollen: Schluesselrollen;
  finanzen: Finanzen;
  tooling: Tooling;
  kontaktdaten: Kontaktdaten;
}

// ===== Project Types =====
export type ProjectStatus = "active" | "completed" | "draft" | "archived";

export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  description: string;
  solutionArea: SolutionArea;
  parameters: ProjectParameters;
  checklist: ChecklistItem[];
  generatedDocuments: GeneratedDocument[];
  progress: number;
}

// ===== Checklist =====
export interface ChecklistItem {
  id: string;
  label: string;
  category: "prepare" | "explore" | "realize" | "deploy" | "run";
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
  linkedDocumentType?: DocumentTemplateType;
}

// ===== Document Types =====
export type DocumentStatus = "generated" | "pending" | "error" | "draft";

export type DocumentTemplateType =
  | "kickoff"
  | "blueprint"
  | "projektplan"
  | "customizing_plan"
  | "golive_planning"
  | "workshop_plan"
  | "testmanagement"
  | "azure_devops_doku";

// Keep legacy type for backward compatibility with mockData
export type DocumentType = DocumentTemplateType | "customizing" | "report" | "checklist";

export type DocumentFormat = "docx" | "pptx" | "xlsx";

export interface DocumentTemplate {
  id: string;
  type: DocumentTemplateType;
  label: string;
  labelEn: string;
  description: string;
  format: DocumentFormat;
  templateFiles: { de: string; en: string };
  applicableAreas: SolutionArea[];
}

export interface GeneratedDocument {
  id: string;
  name: string;
  type: DocumentType;
  version: string;
  status: DocumentStatus;
  createdAt: string;
  projectId: string;
  size?: string;
  format?: DocumentFormat;
}

// ===== Template Types =====
export type TemplateStatus = "active" | "draft" | "deprecated";

export interface Template {
  id: string;
  name: string;
  type: DocumentType;
  version: string;
  language: string;
  status: TemplateStatus;
  description: string;
  lastUpdated: string;
  fields: number;
}

// ===== Activity Types =====
export interface Activity {
  id: string;
  action: string;
  project: string;
  user: string;
  timestamp: string;
  type: "create" | "generate" | "update" | "download";
}
