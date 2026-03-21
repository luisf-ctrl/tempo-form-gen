import type { FormConfig } from "@/types";

export const projectParametersConfig: FormConfig = {
  sections: [
    { id: "projektdaten", title: "Projektdaten", description: "Grundlegende Informationen zum Projekt", order: 1 },
    { id: "organisationen", title: "Organisationen & Partner", description: "Beteiligte Unternehmen und Partner", order: 2 },
    { id: "systemlandschaft", title: "Systemlandschaft", description: "Systeme, Module und Standorte", order: 3 },
    { id: "schluesseltermine", title: "Schlüsseltermine", description: "Meilensteine und Phasen-Endtermine", order: 4 },
    { id: "schluesselrollen", title: "Schlüsselrollen", description: "Projektbeteiligte und Verantwortlichkeiten", order: 5 },
    { id: "finanzen", title: "Finanzen & Aufwände", description: "Budget, Tagessätze und Kalkulationsparameter", order: 6 },
    { id: "tooling", title: "Tooling & Infrastruktur", description: "URLs, E-Mail-Adressen und Support-Kanäle", order: 7 },
    { id: "kontaktdaten", title: "Kontaktdaten", description: "Ansprechpartner und Eskalationskontakte", order: 8 },
  ],
  fields: [
    // === 1. Projektdaten ===
    { id: "projektdaten.name", type: "text", label: "Projektname", placeholder: "z. B. SAP S/4HANA Migration Phase 2", required: true, section: "projektdaten", order: 1 },
    { id: "projektdaten.kuerzel", type: "text", label: "Projektkürzel", placeholder: "z. B. S4M-P2", required: true, helpText: "Max. 10 Zeichen", section: "projektdaten", order: 2, max: 10 },
    { id: "projektdaten.beschreibung", type: "textarea", label: "Projektbeschreibung", placeholder: "Kurze Beschreibung des Projekts...", section: "projektdaten", order: 3, max: 500 },
    { id: "projektdaten.typ", type: "select", label: "Projekttyp", required: true, options: [
      { label: "Neuimplementierung", value: "neuimplementierung" },
      { label: "Migration", value: "migration" },
      { label: "Rollout", value: "rollout" },
      { label: "Optimierung", value: "optimierung" },
    ], section: "projektdaten", order: 4 },

    // === 2. Organisationen & Partner ===
    { id: "organisationen.auftraggeber", type: "text", label: "Auftraggeber (Kundenunternehmen)", placeholder: "Name des Auftraggebers", required: true, section: "organisationen", order: 1 },
    { id: "organisationen.implementierungspartner", type: "text", label: "Implementierungspartner", placeholder: "z. B. Beratungsunternehmen", section: "organisationen", order: 2 },
    { id: "organisationen.dienstleister", type: "text", label: "Dienstleister / Sublieferant", placeholder: "Externe Dienstleister", section: "organisationen", order: 3 },
    { id: "organisationen.kundePartner", type: "text", label: "Kunde / Partner (allgemein)", placeholder: "Weitere Partner", section: "organisationen", order: 4 },

    // === 3. Systemlandschaft ===
    { id: "systemlandschaft.systemA", type: "text", label: "System A (Primärsystem)", placeholder: "z. B. SAP S/4HANA", helpText: "Hauptsystem des Projekts", section: "systemlandschaft", order: 1 },
    { id: "systemlandschaft.systemB", type: "text", label: "System B (Sekundärsystem)", placeholder: "z. B. SAP EWM", section: "systemlandschaft", order: 2 },
    { id: "systemlandschaft.altsystem", type: "text", label: "Altsystem / Legacy", placeholder: "z. B. SAP ECC 6.0", section: "systemlandschaft", order: 3 },
    { id: "systemlandschaft.modulA", type: "text", label: "Modul A", placeholder: "z. B. MM, SD, PP", section: "systemlandschaft", order: 4 },
    { id: "systemlandschaft.modulB", type: "text", label: "Modul B", placeholder: "z. B. FI, CO", section: "systemlandschaft", order: 5 },
    { id: "systemlandschaft.standortWerk", type: "text", label: "Standort / Werk", placeholder: "z. B. Werk Hamburg", section: "systemlandschaft", order: 6 },

    // === 4. Schlüsseltermine ===
    { id: "schluesseltermine.projektstart", type: "date", label: "Projektstart", required: true, section: "schluesseltermine", order: 1 },
    { id: "schluesseltermine.endePrepare", type: "date", label: "Ende Prepare-Phase", section: "schluesseltermine", order: 2 },
    { id: "schluesseltermine.endeExplore", type: "date", label: "Ende Explore-Phase", section: "schluesseltermine", order: 3 },
    { id: "schluesseltermine.endeRealize", type: "date", label: "Ende Realize-Phase", section: "schluesseltermine", order: 4 },
    { id: "schluesseltermine.goLive", type: "date", label: "Go-Live Datum", section: "schluesseltermine", order: 5 },
    { id: "schluesseltermine.endeHypercare", type: "date", label: "Ende Hypercare", section: "schluesseltermine", order: 6 },
    { id: "schluesseltermine.projektende", type: "date", label: "Projektende", section: "schluesseltermine", order: 7 },

    // === 5. Schlüsselrollen ===
    { id: "schluesselrollen.plAG", type: "text", label: "Projektleiter Auftraggeber", placeholder: "Name", section: "schluesselrollen", order: 1 },
    { id: "schluesselrollen.plSI", type: "text", label: "Projektleiter Implementierungspartner", placeholder: "Name", section: "schluesselrollen", order: 2 },
    { id: "schluesselrollen.itLeitung", type: "text", label: "IT-Leitung / CIO", placeholder: "Name", section: "schluesselrollen", order: 3 },
    { id: "schluesselrollen.sponsor", type: "text", label: "Projektsponsor", placeholder: "Name", section: "schluesselrollen", order: 4 },
    { id: "schluesselrollen.cutoverManager", type: "text", label: "Cutover Manager", placeholder: "Name", section: "schluesselrollen", order: 5 },
    { id: "schluesselrollen.testManager", type: "text", label: "Testmanager", placeholder: "Name", section: "schluesselrollen", order: 6 },
    { id: "schluesselrollen.changeManager", type: "text", label: "Change Manager", placeholder: "Name", section: "schluesselrollen", order: 7 },
    { id: "schluesselrollen.streamLeadA", type: "text", label: "Stream Lead A", placeholder: "Name", section: "schluesselrollen", order: 8 },
    { id: "schluesselrollen.streamLeadB", type: "text", label: "Stream Lead B", placeholder: "Name", section: "schluesselrollen", order: 9 },
    { id: "schluesselrollen.keyUserModulA", type: "text", label: "Key User Modul A", placeholder: "Name", section: "schluesselrollen", order: 10 },
    { id: "schluesselrollen.keyUserModulB", type: "text", label: "Key User Modul B", placeholder: "Name", section: "schluesselrollen", order: 11 },

    // === 6. Finanzen & Aufwände ===
    { id: "finanzen.tagessatzSenior", type: "number", label: "Tagessatz Senior Berater (€)", placeholder: "z. B. 1500", min: 0, section: "finanzen", order: 1 },
    { id: "finanzen.tagessatzJunior", type: "number", label: "Tagessatz Junior Berater (€)", placeholder: "z. B. 900", min: 0, section: "finanzen", order: 2 },
    { id: "finanzen.reisekostenfaktor", type: "number", label: "Reisekostenfaktor", placeholder: "z. B. 1.15", helpText: "Multiplikator für Reisekosten", section: "finanzen", order: 3 },
    { id: "finanzen.gesamtbudget", type: "number", label: "Gesamtbudget (€)", placeholder: "z. B. 500000", min: 0, section: "finanzen", order: 4 },
    { id: "finanzen.atMonat", type: "number", label: "Arbeitstage pro Monat", placeholder: "z. B. 20", min: 1, max: 31, section: "finanzen", order: 5 },

    // === 7. Tooling & Infrastruktur ===
    { id: "tooling.serviceDeskUrl", type: "text", label: "Service Desk URL", placeholder: "https://servicedesk.example.com", section: "tooling", order: 1 },
    { id: "tooling.wikiUrl", type: "text", label: "Wiki / Knowledge Base URL", placeholder: "https://wiki.example.com", section: "tooling", order: 2 },
    { id: "tooling.emailSupport", type: "text", label: "E-Mail Support Standard", placeholder: "support@example.com", section: "tooling", order: 3 },
    { id: "tooling.emailPrioritaet", type: "text", label: "E-Mail Support Priorität", placeholder: "priority@example.com", section: "tooling", order: 4 },
    { id: "tooling.emailCR", type: "text", label: "E-Mail Change Requests", placeholder: "change-requests@example.com", section: "tooling", order: 5 },

    // === 8. Kontaktdaten ===
    { id: "kontaktdaten.ansprechpartnerAG", type: "text", label: "Hauptansprechpartner AG (Name)", placeholder: "Vor- und Nachname", section: "kontaktdaten", order: 1 },
    { id: "kontaktdaten.ansprechpartnerAGEmail", type: "text", label: "Hauptansprechpartner AG (E-Mail)", placeholder: "email@kunde.com", section: "kontaktdaten", order: 2 },
    { id: "kontaktdaten.ansprechpartnerSI", type: "text", label: "Hauptansprechpartner SI (Name)", placeholder: "Vor- und Nachname", section: "kontaktdaten", order: 3 },
    { id: "kontaktdaten.ansprechpartnerSIEmail", type: "text", label: "Hauptansprechpartner SI (E-Mail)", placeholder: "email@partner.com", section: "kontaktdaten", order: 4 },
    { id: "kontaktdaten.eskalationskontakt", type: "text", label: "Eskalationskontakt (Name)", placeholder: "Vor- und Nachname", section: "kontaktdaten", order: 5 },
    { id: "kontaktdaten.eskalationskontaktEmail", type: "text", label: "Eskalationskontakt (E-Mail)", placeholder: "escalation@example.com", section: "kontaktdaten", order: 6 },
  ],
};

// Mapping: parameter section IDs to wizard step indices
export const parameterSteps = [
  { label: "Projektdaten", sectionId: "projektdaten" },
  { label: "Organisationen", sectionId: "organisationen" },
  { label: "Systemlandschaft", sectionId: "systemlandschaft" },
  { label: "Schlüsseltermine", sectionId: "schluesseltermine" },
  { label: "Schlüsselrollen", sectionId: "schluesselrollen" },
  { label: "Finanzen", sectionId: "finanzen" },
  { label: "Tooling", sectionId: "tooling" },
  { label: "Kontaktdaten", sectionId: "kontaktdaten" },
];
