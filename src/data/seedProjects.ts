import type { Project, SolutionArea } from "@/types";
import { generateChecklist } from "@/lib/checklistGenerator";

const SEED_KEY = "projectgen_seeded_v1";

function makeSeedProject(
  id: string,
  name: string,
  client: string,
  description: string,
  status: "active" | "completed" | "draft" | "archived",
  solutionArea: SolutionArea,
  progress: number,
  createdAt: string,
  updatedAt: string,
  params: any,
  docs: any[]
): Project {
  const checklist = generateChecklist();
  // Mark some checklist items as completed based on progress
  const doneCount = Math.floor((progress / 100) * checklist.length);
  checklist.forEach((item, i) => {
    if (i < doneCount) {
      item.completed = true;
      item.completedAt = updatedAt;
    }
  });

  return {
    id,
    name,
    client,
    status,
    createdAt,
    updatedAt,
    description,
    solutionArea,
    parameters: params,
    checklist,
    generatedDocuments: docs,
    progress,
  };
}

export function seedProjectsIfNeeded(): void {
  if (localStorage.getItem(SEED_KEY)) return;

  const existing = localStorage.getItem("projectgen_projects");
  if (existing) {
    try {
      const arr = JSON.parse(existing);
      if (arr.length > 0) {
        localStorage.setItem(SEED_KEY, "true");
        return;
      }
    } catch {}
  }

  const project1 = makeSeedProject(
    "seed-p1",
    "SAP MM Mobile Rollout",
    "Stadtwerke Bielefeld",
    "Einführung der mobilen Materialwirtschaft mit SAP S/4HANA und ServiceOS für Wareneingang, Warenausgang und Inventur an 3 Werken.",
    "active",
    "material_management",
    65,
    "2026-01-10",
    "2026-03-20",
    {
      projektdaten: {
        name: "SAP MM Mobile Rollout",
        kuerzel: "SWBI-MM",
        beschreibung: "Einführung der mobilen Materialwirtschaft mit SAP S/4HANA und ServiceOS für Wareneingang, Warenausgang und Inventur an 3 Werken.",
        typ: "Neuimplementierung",
      },
      organisationen: {
        auftraggeber: "Stadtwerke Bielefeld",
        implementierungspartner: "Nexuma GmbH",
        dienstleister: "ServiceOS AG",
        kundePartner: "Stadtwerke IT Services",
      },
      systemlandschaft: {
        systemA: "SAP S/4HANA 2023",
        systemB: "ServiceOS Mobile Platform",
        altsystem: "SAP ECC 6.0 EHP8",
        modulA: "MM – Materialwirtschaft",
        modulB: "WM – Warehouse Management",
        standortWerk: "1000, 2000, 3000",
      },
      schluesseltermine: {
        projektstart: "2026-01-10",
        endePrepare: "2026-02-15",
        endeExplore: "2026-04-01",
        endeRealize: "2026-06-30",
        goLive: "2026-08-01",
        endeHypercare: "2026-09-30",
        projektende: "2026-10-31",
      },
      schluesselrollen: {
        plAG: "Dr. Martin Weber",
        plSI: "Thomas Kern",
        itLeitung: "Sandra Fischer",
        sponsor: "Klaus Bergmann (Vorstand Technik)",
        cutoverManager: "Lisa Meier",
        testManager: "Michael Braun",
        changeManager: "Anna Schulz",
        streamLeadA: "Peter Hoffmann (MM)",
        streamLeadB: "Julia Neumann (WM)",
        keyUserModulA: "Frank Müller",
        keyUserModulB: "Sabine Koch",
      },
      finanzen: {
        tagessatzSenior: 1450,
        tagessatzJunior: 950,
        reisekostenfaktor: 1.15,
        gesamtbudget: 480000,
        atMonat: 22,
      },
      tooling: {
        serviceDeskUrl: "https://jira.stadtwerke-bi.de/projects/SAPMM",
        wikiUrl: "https://confluence.stadtwerke-bi.de/spaces/SAPMM",
        emailSupport: "sap-support@stadtwerke-bielefeld.de",
        emailPrioritaet: "sap-prio@stadtwerke-bielefeld.de",
        emailCR: "sap-cr@stadtwerke-bielefeld.de",
      },
      kontaktdaten: {
        ansprechpartnerAG: "Dr. Martin Weber",
        ansprechpartnerAGEmail: "m.weber@stadtwerke-bielefeld.de",
        ansprechpartnerSI: "Thomas Kern",
        ansprechpartnerSIEmail: "t.kern@nexuma.com",
        eskalationskontakt: "Klaus Bergmann",
        eskalationskontaktEmail: "k.bergmann@stadtwerke-bielefeld.de",
      },
    },
    [
      {
        id: "sd1-d1",
        name: "Kick-off Präsentation – SAP MM Mobile",
        type: "kickoff" as const,
        version: "1.0",
        status: "generated" as const,
        createdAt: "2026-01-15",
        projectId: "seed-p1",
        size: "2.8 MB",
        format: "pptx" as const,
      },
      {
        id: "sd1-d2",
        name: "Blueprint – Materialwirtschaft Mobile",
        type: "blueprint" as const,
        version: "2.1",
        status: "generated" as const,
        createdAt: "2026-03-01",
        projectId: "seed-p1",
        size: "4.6 MB",
        format: "docx" as const,
      },
      {
        id: "sd1-d3",
        name: "Testmanagement-Plan MM",
        type: "testmanagement" as const,
        version: "1.0",
        status: "generated" as const,
        createdAt: "2026-03-10",
        projectId: "seed-p1",
        size: "1.2 MB",
        format: "xlsx" as const,
      },
    ]
  );

  const project2 = makeSeedProject(
    "seed-p2",
    "ServiceOS Field Service Implementierung",
    "EnBW Energie Baden-Württemberg",
    "Implementierung der mobilen Instandhaltungslösung ServiceOS mit Integration in SAP PM/CS für den technischen Außendienst.",
    "active",
    "maintenance_os",
    35,
    "2026-02-01",
    "2026-03-18",
    {
      projektdaten: {
        name: "ServiceOS Field Service Implementierung",
        kuerzel: "ENBW-FS",
        beschreibung: "Implementierung der mobilen Instandhaltungslösung ServiceOS mit Integration in SAP PM/CS für den technischen Außendienst.",
        typ: "Neuimplementierung",
      },
      organisationen: {
        auftraggeber: "EnBW Energie Baden-Württemberg",
        implementierungspartner: "Nexuma GmbH",
        dienstleister: "ServiceOS AG",
        kundePartner: "EnBW IT Solutions",
      },
      systemlandschaft: {
        systemA: "SAP S/4HANA 2024",
        systemB: "ServiceOS Field Service",
        altsystem: "SAP PM on ECC 6.0",
        modulA: "PM – Plant Maintenance",
        modulB: "CS – Customer Service",
        standortWerk: "4000, 4100, 4200",
      },
      schluesseltermine: {
        projektstart: "2026-02-01",
        endePrepare: "2026-03-15",
        endeExplore: "2026-05-31",
        endeRealize: "2026-08-31",
        goLive: "2026-10-01",
        endeHypercare: "2026-11-30",
        projektende: "2026-12-31",
      },
      schluesselrollen: {
        plAG: "Christine Bauer",
        plSI: "Max Berger",
        itLeitung: "Ralf Zimmermann",
        sponsor: "Dr. Ulrike Hartmann (CTO)",
        cutoverManager: "Stefan Kraus",
        testManager: "Monika Vogel",
        changeManager: "Daniela Richter",
        streamLeadA: "Jörg Lehmann (PM)",
        streamLeadB: "Katrin Wolf (CS)",
        keyUserModulA: "Andreas Schreiber",
        keyUserModulB: "Birgit Lang",
      },
      finanzen: {
        tagessatzSenior: 1550,
        tagessatzJunior: 1050,
        reisekostenfaktor: 1.2,
        gesamtbudget: 720000,
        atMonat: 20,
      },
      tooling: {
        serviceDeskUrl: "https://jira.enbw.com/projects/SRVOS",
        wikiUrl: "https://confluence.enbw.com/spaces/SRVOS",
        emailSupport: "field-service@enbw.com",
        emailPrioritaet: "fs-prio@enbw.com",
        emailCR: "fs-cr@enbw.com",
      },
      kontaktdaten: {
        ansprechpartnerAG: "Christine Bauer",
        ansprechpartnerAGEmail: "c.bauer@enbw.com",
        ansprechpartnerSI: "Max Berger",
        ansprechpartnerSIEmail: "m.berger@nexuma.com",
        eskalationskontakt: "Dr. Ulrike Hartmann",
        eskalationskontaktEmail: "u.hartmann@enbw.com",
      },
    },
    [
      {
        id: "sd2-d1",
        name: "Kick-off Präsentation – Field Service",
        type: "kickoff" as const,
        version: "1.0",
        status: "generated" as const,
        createdAt: "2026-02-10",
        projectId: "seed-p2",
        size: "3.1 MB",
        format: "pptx" as const,
      },
      {
        id: "sd2-d2",
        name: "Blueprint – Instandhaltung ServiceOS",
        type: "blueprint" as const,
        version: "1.0",
        status: "pending" as const,
        createdAt: "2026-03-15",
        projectId: "seed-p2",
        size: "—",
        format: "docx" as const,
      },
    ]
  );

  const projects = [project1, project2];
  localStorage.setItem("projectgen_projects", JSON.stringify(projects));
  localStorage.setItem(SEED_KEY, "true");
}
