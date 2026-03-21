import type { Project, ProjectParameters, ChecklistItem, GeneratedDocument, SolutionArea } from "@/types";
import { generateChecklist } from "./checklistGenerator";

const STORAGE_KEY = "projectgen_projects";

function emptyParameters(): ProjectParameters {
  return {
    projektdaten: { name: "", kuerzel: "", beschreibung: "", typ: "" },
    organisationen: { auftraggeber: "", implementierungspartner: "", dienstleister: "", kundePartner: "" },
    systemlandschaft: { systemA: "", systemB: "", altsystem: "", modulA: "", modulB: "", standortWerk: "" },
    schluesseltermine: { projektstart: "", endePrepare: "", endeExplore: "", endeRealize: "", goLive: "", endeHypercare: "", projektende: "" },
    schluesselrollen: { plAG: "", plSI: "", itLeitung: "", sponsor: "", cutoverManager: "", testManager: "", changeManager: "", streamLeadA: "", streamLeadB: "", keyUserModulA: "", keyUserModulB: "" },
    finanzen: { tagessatzSenior: "", tagessatzJunior: "", reisekostenfaktor: "", gesamtbudget: "", atMonat: "" },
    tooling: { serviceDeskUrl: "", wikiUrl: "", emailSupport: "", emailPrioritaet: "", emailCR: "" },
    kontaktdaten: { ansprechpartnerAG: "", ansprechpartnerAGEmail: "", ansprechpartnerSI: "", ansprechpartnerSIEmail: "", eskalationskontakt: "", eskalationskontaktEmail: "" },
  };
}

export function getProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getProject(id: string): Project | null {
  return getProjects().find((p) => p.id === id) || null;
}

export function saveProject(project: Project): void {
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    projects[idx] = project;
  } else {
    projects.push(project);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function createProject(name: string, client: string, description: string, solutionArea: SolutionArea): Project {
  const now = new Date().toISOString().slice(0, 10);
  const id = `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const params = emptyParameters();
  params.projektdaten.name = name;
  params.organisationen.auftraggeber = client;
  params.projektdaten.beschreibung = description;

  const project: Project = {
    id,
    name,
    client,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    description,
    solutionArea,
    parameters: params,
    checklist: generateChecklist(),
    generatedDocuments: [],
    progress: 0,
  };

  saveProject(project);
  return project;
}

export function updateProjectParameters(id: string, params: ProjectParameters): void {
  const project = getProject(id);
  if (!project) return;
  project.parameters = params;
  project.updatedAt = new Date().toISOString().slice(0, 10);
  // Sync top-level fields
  project.name = params.projektdaten.name || project.name;
  project.client = params.organisationen.auftraggeber || project.client;
  project.description = params.projektdaten.beschreibung || project.description;
  saveProject(project);
}

export function updateChecklist(id: string, checklist: ChecklistItem[]): void {
  const project = getProject(id);
  if (!project) return;
  project.checklist = checklist;
  project.updatedAt = new Date().toISOString().slice(0, 10);
  // Update progress from checklist
  const total = checklist.length;
  const done = checklist.filter((c) => c.completed).length;
  project.progress = total > 0 ? Math.round((done / total) * 100) : 0;
  saveProject(project);
}

export function addGeneratedDocument(id: string, doc: GeneratedDocument): void {
  const project = getProject(id);
  if (!project) return;
  project.generatedDocuments.push(doc);
  project.updatedAt = new Date().toISOString().slice(0, 10);
  saveProject(project);
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

// Flatten project parameters into a placeholder map for template generation
export function buildProjectPlaceholderMap(project: Project): Record<string, string> {
  const p = project.parameters;
  return {
    // Projektdaten
    project_name: p.projektdaten.name,
    projektname: p.projektdaten.name,
    projektkuerzel: p.projektdaten.kuerzel,
    projektbeschreibung: p.projektdaten.beschreibung,
    projekttyp: p.projektdaten.typ,
    // Organisationen
    auftraggeber: p.organisationen.auftraggeber,
    customer_name: p.organisationen.auftraggeber,
    implementierungspartner: p.organisationen.implementierungspartner,
    dienstleister: p.organisationen.dienstleister,
    kunde_partner: p.organisationen.kundePartner,
    // Systemlandschaft
    system_a: p.systemlandschaft.systemA,
    system_b: p.systemlandschaft.systemB,
    altsystem: p.systemlandschaft.altsystem,
    modul_a: p.systemlandschaft.modulA,
    modul_b: p.systemlandschaft.modulB,
    standort: p.systemlandschaft.standortWerk,
    werk: p.systemlandschaft.standortWerk,
    // Schlüsseltermine
    projektstart: p.schluesseltermine.projektstart,
    project_start: p.schluesseltermine.projektstart,
    ende_prepare: p.schluesseltermine.endePrepare,
    ende_explore: p.schluesseltermine.endeExplore,
    ende_realize: p.schluesseltermine.endeRealize,
    go_live_datum: p.schluesseltermine.goLive,
    go_live: p.schluesseltermine.goLive,
    ende_hypercare: p.schluesseltermine.endeHypercare,
    projektende: p.schluesseltermine.projektende,
    // Schlüsselrollen
    projektleiter_ag: p.schluesselrollen.plAG,
    projektleiter_si: p.schluesselrollen.plSI,
    it_leitung: p.schluesselrollen.itLeitung,
    projektsponsor: p.schluesselrollen.sponsor,
    cutover_manager: p.schluesselrollen.cutoverManager,
    testmanager: p.schluesselrollen.testManager,
    change_manager: p.schluesselrollen.changeManager,
    stream_lead_a: p.schluesselrollen.streamLeadA,
    stream_lead_b: p.schluesselrollen.streamLeadB,
    key_user_modul_a: p.schluesselrollen.keyUserModulA,
    key_user_modul_b: p.schluesselrollen.keyUserModulB,
    author: p.schluesselrollen.plSI || p.schluesselrollen.plAG,
    // Finanzen
    rate: String(p.finanzen.tagessatzSenior || ""),
    rate_junior: String(p.finanzen.tagessatzJunior || ""),
    faktor: String(p.finanzen.reisekostenfaktor || ""),
    gesamtbudget: String(p.finanzen.gesamtbudget || ""),
    at_monat: String(p.finanzen.atMonat || ""),
    // Tooling
    service_desk_url: p.tooling.serviceDeskUrl,
    wiki_url: p.tooling.wikiUrl,
    email_support: p.tooling.emailSupport,
    email_prioritaet: p.tooling.emailPrioritaet,
    email_cr: p.tooling.emailCR,
    // Kontaktdaten
    ansprechpartner_ag: p.kontaktdaten.ansprechpartnerAG,
    ansprechpartner_ag_email: p.kontaktdaten.ansprechpartnerAGEmail,
    ansprechpartner_si: p.kontaktdaten.ansprechpartnerSI,
    ansprechpartner_si_email: p.kontaktdaten.ansprechpartnerSIEmail,
    eskalationskontakt: p.kontaktdaten.eskalationskontakt,
    eskalationskontakt_email: p.kontaktdaten.eskalationskontaktEmail,
    // Meta
    generation_date: new Date().toLocaleDateString("de-DE"),
  };
}
