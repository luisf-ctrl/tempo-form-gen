import type { FormConfig } from "@/types";

export const blueprintWizardSteps = [
  { id: "project", label: "Projekt", description: "Projektinformationen", icon: "folder" },
  { id: "system", label: "System", description: "Systemintegration & Verbindung", icon: "server" },
  { id: "organization", label: "Organisation", description: "Werke, Lagerorte & Materialien", icon: "building" },
  { id: "processes", label: "Prozesse", description: "Logistikprozesse auswählen", icon: "git-branch" },
  { id: "rules", label: "Prozessregeln", description: "Bewegungsarten & Regelwerk", icon: "sliders" },
  { id: "mobile", label: "Mobile / UI", description: "Mobile App Einstellungen", icon: "smartphone" },
  { id: "generate", label: "Abschluss", description: "Dokumente erzeugen", icon: "sparkles" },
];

export const blueprintFormConfig: FormConfig = {
  sections: [
    // Step 0: Project
    { id: "project", title: "Projektinformationen", description: "Grundlegende Informationen zum Projekt", order: 1 },
    // Step 1: System
    { id: "system", title: "Systemintegration", description: "ERP-System und Verbindungsparameter", order: 2 },
    // Step 2: Organization
    { id: "organization", title: "Organisation & Material", description: "Werke, Lagerorte und Materialstruktur", order: 3 },
    // Step 3: Processes
    { id: "processes", title: "Logistikprozesse", description: "Wählen Sie die relevanten Prozesse aus", order: 4 },
    // Step 4: Rules - Movement types & order rules
    { id: "rules_gi", title: "Warenausgang – Bewegungsarten", description: "Bewegungsarten für Warenausgänge", order: 5 },
    { id: "rules_gr", title: "Wareneingang – Bewegungsarten", description: "Bewegungsarten für Wareneingänge", order: 6 },
    { id: "rules_return", title: "Retoure – Bewegungsarten", description: "Bewegungsarten für Retouren", order: 7 },
    { id: "rules_order", title: "Auftragsregeln", description: "Erlaubte Auftragsarten und Status", order: 8 },
    { id: "rules_inventory", title: "Inventur", description: "Inventurbelegarten und Einstellungen", order: 9 },
    { id: "rules_material", title: "Materialregeln", description: "Materialtypen und Statusfilter", order: 10 },
    // Step 5: Mobile
    { id: "mobile", title: "Mobile App Einstellungen", description: "Konfiguration der mobilen Anwendung", order: 11 },
  ],
  fields: [
    // ===== Step 0: Project =====
    { id: "project_name", type: "text", label: "Projektname", placeholder: "z. B. osapiens HUB for Material Management", required: true, section: "project", order: 1 },
    { id: "customer_name", type: "text", label: "Kunde", placeholder: "Kundenname", required: true, section: "project", order: 2 },
    { id: "author", type: "text", label: "Autor / Bearbeiter", placeholder: "z. B. Max Mustermann", section: "project", order: 3, helpText: "Name des Dokumentautors für die Versionshistorie" },
    { id: "project_start", type: "date", label: "Projektstart", section: "project", order: 4, helpText: "Geplanter Projektstart" },
    { id: "language", type: "select", label: "Sprache", required: true, options: [
      { label: "Deutsch", value: "Deutsch" },
      { label: "Englisch", value: "Englisch" },
      { label: "Französisch", value: "Französisch" },
    ], section: "project", order: 5, helpText: "Sprache, in der das Dokument generiert wird" },

    // ===== Step 1: System =====
    { id: "currency", type: "select", label: "Währung", required: true, options: [
      { label: "EUR", value: "EUR" },
      { label: "USD", value: "USD" },
      { label: "CHF", value: "CHF" },
      { label: "GBP", value: "GBP" },
    ], section: "system", order: 0 },
    { id: "erp_system", type: "select", label: "ERP System", required: true, options: [
      { label: "SAP S/4HANA", value: "SAP" },
      { label: "SAP ECC", value: "SAP_ECC" },
      { label: "SAP Business One", value: "SAP_B1" },
    ], section: "system", order: 1 },
    { id: "system_id", type: "text", label: "System ID", placeholder: "z. B. QC2", required: true, section: "system", order: 2, helpText: "Die dreistellige System-ID des SAP-Systems" },
    { id: "sap_client", type: "text", label: "Mandant", placeholder: "z. B. 100", required: true, section: "system", order: 3 },
    { id: "instance_number", type: "text", label: "Instanznummer", placeholder: "z. B. 00", required: true, section: "system", order: 4 },
    { id: "application_server", type: "text", label: "Anwendungsserver", placeholder: "z. B. vhiznqc2ci.sap.intense.de", section: "system", order: 5, helpText: "Hostname oder IP des SAP Application Servers" },
    { id: "sap_router_string", type: "text", label: "SAP Router String", placeholder: "/H/saprouter/...", section: "system", order: 6, helpText: "Optional, falls über SAP Router verbunden" },
    { id: "authentication_type", type: "select", label: "Authentifizierung", required: true, options: [
      { label: "Benutzer / Passwort", value: "basic" },
      { label: "OIDC", value: "OIDC" },
      { label: "SSO / SAML", value: "sso" },
      { label: "Zertifikatsbasiert", value: "certificate" },
    ], section: "system", order: 7 },
    { id: "identity_provider", type: "text", label: "Identity Provider", placeholder: "z. B. Azure AD", section: "system", order: 8, helpText: "Name des Identity Providers für SSO/OIDC" },

    // ===== Step 2: Organization & Material =====
    { id: "plant_id", type: "text", label: "Werk", placeholder: "z. B. WIN", required: true, section: "organization", order: 1, helpText: "SAP Werkskennzeichen" },
    { id: "storage_locations", type: "textarea", label: "Lagerorte (kommagetrennt)", placeholder: "0001, 0002, 0003", required: true, section: "organization", order: 2, helpText: "Geben Sie die Lagerort-IDs kommagetrennt ein" },
    { id: "number_of_storage_locations", type: "number", label: "Anzahl Lagerorte", required: true, min: 1, max: 50, section: "organization", order: 3 },
    { id: "number_of_materials", type: "number", label: "Anzahl Materialien", min: 0, section: "organization", order: 4, helpText: "Ungefähre Anzahl der zu verwaltenden Materialien" },

    // ===== Step 3: Processes =====
    { id: "pbm1100", type: "checkbox", label: "PBM1100 – Wareneingang Bestellung", section: "processes", order: 1 },
    { id: "pbm1200", type: "checkbox", label: "PBM1200 – Wareneingang Fertigungsauftrag", section: "processes", order: 2 },
    { id: "pbm1300", type: "checkbox", label: "PBM1300 – Retoure Kostenstelle", section: "processes", order: 3 },
    { id: "pbm2100", type: "checkbox", label: "PBM2100 – Warenausgang Reservierung", section: "processes", order: 4 },
    { id: "pbm2200", type: "checkbox", label: "PBM2200 – Warenausgang Kostenstelle", section: "processes", order: 5 },
    { id: "pbm2300", type: "checkbox", label: "PBM2300 – Warenausgang Auftrag", section: "processes", order: 6 },
    { id: "pbm3000", type: "checkbox", label: "PBM3000 – Inventur", section: "processes", order: 7 },

    // ===== Step 4: Rules =====

    // -- Warenausgang Bewegungsarten --
    { id: "movement_type_production_order", type: "text", label: "WA Fertigungsauftrag", placeholder: "z. B. 261", section: "rules_gi", order: 1, helpText: "Bewegungsart für Warenausgang zum Fertigungsauftrag" },
    { id: "movement_type_network_order", type: "text", label: "WA Netzplanauftrag", placeholder: "z. B. 281", section: "rules_gi", order: 2, helpText: "Bewegungsart für Warenausgang zum Netzplanauftrag" },
    { id: "movement_type_cost_center", type: "text", label: "WA Kostenstelle", placeholder: "z. B. 201", section: "rules_gi", order: 3, helpText: "Bewegungsart für Warenausgang zur Kostenstelle" },
    { id: "movement_type_reservation", type: "text", label: "WA Reservierung", placeholder: "z. B. 261", section: "rules_gi", order: 4, helpText: "Bewegungsart für Warenausgang zur Reservierung" },

    // -- Wareneingang Bewegungsarten --
    { id: "movement_type_gr_po", type: "text", label: "WE Bestellung", placeholder: "z. B. 101", section: "rules_gr", order: 1, helpText: "Bewegungsart für Wareneingang zur Bestellung" },
    { id: "movement_type_gr_production", type: "text", label: "WE Fertigungsauftrag", placeholder: "z. B. 101", section: "rules_gr", order: 2, helpText: "Bewegungsart für Wareneingang aus Produktion" },

    // -- Retoure Bewegungsarten --
    { id: "movement_type_return_order", type: "text", label: "Retoure Auftrag", placeholder: "z. B. 262", section: "rules_return", order: 1 },
    { id: "movement_type_return_cost_center", type: "text", label: "Retoure Kostenstelle", placeholder: "z. B. 202", section: "rules_return", order: 2 },

    // -- Auftragsregeln --
    { id: "allowed_order_types", type: "text", label: "Erlaubte Auftragsarten", placeholder: "z. B. ZP*", section: "rules_order", order: 1, helpText: "Kommagetrennt oder mit Wildcard" },
    { id: "allowed_order_status", type: "text", label: "Erlaubte Auftragsstatus", placeholder: "z. B. FREI, RÜCK, TRÜCK", section: "rules_order", order: 2 },
    { id: "excluded_order_status", type: "text", label: "Ausgeschlossene Auftragsstatus", placeholder: "z. B. EROF, TABG, ABGS", section: "rules_order", order: 3 },

    // -- Inventur --
    { id: "inventory_doc_types", type: "text", label: "Inventurbelegarten", placeholder: "z. B. IB, IN", section: "rules_inventory", order: 1 },
    { id: "inventory_history_days", type: "number", label: "Historientage", min: 1, max: 365, section: "rules_inventory", order: 2, helpText: "Wie viele Tage soll die Inventurhistorie vorgehalten werden?" },

    // -- Material Rules --
    { id: "material_types", type: "text", label: "Materialtypen", placeholder: "z. B. ROH, HALB, FERT", section: "rules_material", order: 1, helpText: "Kommagetrennte Liste relevanter Materialtypen" },
    { id: "excluded_material_status", type: "text", label: "Ausgeschlossene Materialstatus", placeholder: "z. B. GESPERRT, ARCHIVIERT", section: "rules_material", order: 2 },
    { id: "label_print_enabled", type: "checkbox", label: "Etikettendruck aktiv", section: "rules_material", order: 3 },
    { id: "batch_managed", type: "checkbox", label: "Chargenführung aktiv", section: "rules_material", order: 4, helpText: "Materialien werden chargengeführt verwaltet" },
    { id: "sled_relevant", type: "checkbox", label: "SLED relevant (Mindesthaltbarkeit)", section: "rules_material", order: 5 },

    // ===== Step 5: Mobile =====
    { id: "offline_mode", type: "checkbox", label: "Offline Modus aktivieren", section: "mobile", order: 1, helpText: "Ermöglicht die Nutzung der App ohne Netzwerkverbindung" },
    { id: "retry_sync", type: "checkbox", label: "Fehlgeschlagene Synchronisation wiederholen", section: "mobile", order: 2 },
    { id: "receiver_field", type: "checkbox", label: "Empfängerfeld anzeigen", section: "mobile", order: 3, helpText: "Zeigt ein zusätzliches Empfängerfeld in der mobilen Ansicht" },
    { id: "hide_deleted_positions", type: "checkbox", label: "Gelöschte Positionen ausblenden", section: "mobile", order: 4 },
    { id: "sync_mode", type: "select", label: "Synchronisation", options: [
      { label: "Queued Sync", value: "queued_sync" },
      { label: "Automatisch", value: "auto" },
      { label: "Manuell", value: "manual" },
      { label: "Bei WLAN-Verbindung", value: "wifi_only" },
    ], section: "mobile", order: 5 },
  ],
};

// Mapping of wizard step index to section IDs
export const stepSectionMap: Record<number, string[]> = {
  0: ["project"],
  1: ["system"],
  2: ["organization"],
  3: ["processes"],
  4: ["rules_gi", "rules_gr", "rules_return", "rules_order", "rules_inventory", "rules_material"],
  5: ["mobile"],
};

// Default values matching the ZIP sample data
export const blueprintDefaultValues: Record<string, any> = {
  project_name: "osapiens HUB for Material Management",
  customer_name: "Stadtwerk Winterthur",
  language: "Deutsch",
  currency: "CHF",
  erp_system: "SAP",
  system_id: "QC2",
  sap_client: "100",
  instance_number: "00",
  application_server: "vhiznqc2ci.sap.intense.de",
  sap_router_string: "/H/vhiznqc2ci.sap.intense.de",
  authentication_type: "OIDC",
  identity_provider: "Azure AD",
  plant_id: "WIN",
  storage_locations: "0001, 0002",
  number_of_storage_locations: 2,
  number_of_materials: 6000,
  pbm1100: true,
  pbm1200: true,
  pbm1300: true,
  pbm2100: true,
  pbm2200: true,
  pbm2300: true,
  pbm3000: true,
  movement_type_production_order: "261",
  movement_type_network_order: "281",
  movement_type_cost_center: "201",
  movement_type_reservation: "261",
  movement_type_gr_po: "101",
  movement_type_gr_production: "101",
  movement_type_return_order: "262",
  movement_type_return_cost_center: "202",
  allowed_order_types: "ZP*",
  allowed_order_status: "FREI, RÜCK, TRÜCK",
  excluded_order_status: "EROF, TABG, ABGS",
  inventory_doc_types: "IB, IN",
  inventory_history_days: 3,
  material_types: "ROH, HALB, FERT",
  excluded_material_status: "GESPERRT, ARCHIVIERT",
  label_print_enabled: true,
  batch_managed: true,
  sled_relevant: true,
  offline_mode: true,
  retry_sync: true,
  receiver_field: true,
  hide_deleted_positions: true,
  sync_mode: "queued_sync",
};

// Process labels for display
export const PROCESS_LABELS: Array<[string, string]> = [
  ["pbm1100", "PBM1100 – Wareneingang Bestellung"],
  ["pbm1200", "PBM1200 – Wareneingang Fertigungsauftrag"],
  ["pbm1300", "PBM1300 – Retoure Kostenstelle"],
  ["pbm2100", "PBM2100 – Warenausgang Reservierung"],
  ["pbm2200", "PBM2200 – Warenausgang Kostenstelle"],
  ["pbm2300", "PBM2300 – Warenausgang Auftrag"],
  ["pbm3000", "PBM3000 – Inventur"],
];

// Blueprint template with placeholders
export const BLUEPRINT_TEMPLATE = `BUSINESS BLUEPRINT

Projekt: {{project_name}}
Kunde: {{customer_name}}
Sprache: {{language}}
Währung: {{currency}}

System
ERP: {{erp_system}}
System ID: {{system_id}}
Mandant: {{sap_client}}
Anwendungsserver: {{application_server}}
Authentifizierung: {{authentication_type}}
Identity Provider: {{identity_provider}}

Organisation
Werk: {{plant_id}}
Lagerorte: {{storage_locations}}
Anzahl Lagerorte: {{number_of_storage_locations}}
Anzahl Materialien: {{number_of_materials}}

Aktive Prozesse
{{process_list}}

Bewegungsarten
WA Auftrag: {{movement_type_production_order}}
WA Netzplan: {{movement_type_network_order}}
WA Kostenstelle: {{movement_type_cost_center}}
WA Reservierung: {{movement_type_reservation}}
WE Bestellung: {{movement_type_gr_po}}
WE Fertigungsauftrag: {{movement_type_gr_production}}
Retoure Auftrag: {{movement_type_return_order}}
Retoure Kostenstelle: {{movement_type_return_cost_center}}

Auftragsregeln
Erlaubte Auftragsarten: {{allowed_order_types}}
Erlaubte Status: {{allowed_order_status}}
Ausgeschlossene Status: {{excluded_order_status}}

Inventur
Belegarten: {{inventory_doc_types}}
Historientage: {{inventory_history_days}}

Material
Materialtypen: {{material_types}}
Ausgeschlossene Status: {{excluded_material_status}}
Etikettendruck: {{label_print_enabled}}
Chargenführung: {{batch_managed}}
SLED relevant: {{sled_relevant}}

Mobile
Offline: {{offline_mode}}
Retry Sync: {{retry_sync}}
Empfängerfeld: {{receiver_field}}
Sync Mode: {{sync_mode}}`;
