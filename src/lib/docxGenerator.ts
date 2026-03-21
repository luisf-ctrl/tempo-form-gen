import JSZip from "jszip";

// =====================================================================
// 1. CONDITION MAP — maps form field values to IF-block parameter names
// =====================================================================

export function buildConditionMap(formValues: Record<string, any>): Record<string, boolean> {
  return {
    // Process toggles
    INCLUDE_PBM1100: !!formValues.pbm1100,
    INCLUDE_PBM1200: !!formValues.pbm1200,
    INCLUDE_PBM1300: !!formValues.pbm1300,
    INCLUDE_PBM2100: !!formValues.pbm2100,
    INCLUDE_PBM2200: !!formValues.pbm2200,
    INCLUDE_PBM2300: !!formValues.pbm2300,
    INCLUDE_PBM3000: !!formValues.pbm3000,

    // Feature toggles
    USE_MOBILE: !!formValues.offline_mode || !!formValues.receiver_field,
    USE_OFFLINE: !!formValues.offline_mode,
    USE_BARCODE: true, // default on for Material Management
    USE_BATCH: !!formValues.batch_managed,
    USE_SLED: !!formValues.sled_relevant,
    USE_LABEL_PRINT: !!formValues.label_print_enabled,
  };
}

// =====================================================================
// 2. PLACEHOLDER MAP — maps form fields to template placeholder names
// =====================================================================

export function buildPlaceholderMap(formValues: Record<string, any>): Record<string, string> {
  const boolToJaNein = (v: any) => (v ? "Ja" : "Nein");
  const str = (v: any) => (v != null && v !== "" ? String(v) : "TBD");

  const erpLabel = formValues.erp_system === "SAP" ? "SAP S/4HANA" :
    formValues.erp_system === "SAP_ECC" ? "SAP ECC" :
    formValues.erp_system === "SAP_B1" ? "SAP Business One" : str(formValues.erp_system);

  const authLabel = formValues.authentication_type === "basic" ? "Benutzer / Passwort" :
    formValues.authentication_type === "OIDC" ? "OIDC (OpenID Connect)" :
    formValues.authentication_type === "sso" ? "SSO / SAML" :
    formValues.authentication_type === "certificate" ? "Zertifikatsbasiert" : str(formValues.authentication_type);

  const map: Record<string, string> = {
    // Project
    projektname: str(formValues.project_name),
    projektstart: str(formValues.project_start),
    autor: str(formValues.author),
    kunde: str(formValues.customer_name),
    sprache: str(formValues.language),
    language: str(formValues.language),
    currency_country: str(formValues.currency),

    // System
    erp_system: erpLabel,
    system_id: str(formValues.system_id),
    sap_client: str(formValues.sap_client),
    instance_number: str(formValues.instance_number),
    application_server: str(formValues.application_server),
    sap_router_string: str(formValues.sap_router_string),
    authentication_method: authLabel,
    identity_provider: str(formValues.identity_provider),

    // SAP Systems (dev/test/prod)
    sap_system_dev: str(formValues.system_id) !== "TBD" ? `${formValues.system_id}-DEV` : "TBD",
    sap_system_test: str(formValues.system_id) !== "TBD" ? `${formValues.system_id}-TEST` : "TBD",
    sap_system_prod: str(formValues.system_id) !== "TBD" ? `${formValues.system_id}-PROD` : "TBD",

    // Organization
    plant_id: str(formValues.plant_id),
    sap_werks: str(formValues.plant_id),
    sap_lgort: str(formValues.storage_locations),
    lagerort_id: str(formValues.storage_locations),
    storage_location_id: str(formValues.storage_locations),
    anzahl_materialien: str(formValues.number_of_materials),
    anzahl_lagerorte: str(formValues.number_of_storage_locations),

    // Material rules
    relevante_materialtypen: str(formValues.material_types),
    materialtypen_erlaubt: str(formValues.excluded_material_status),
    material_types: str(formValues.material_types),
    material_number: "TBD",
    base_unit_of_measure: "TBD",

    // Processes (active/inactive labels)
    prozess_wareneingang: formValues.pbm1100 ? "Wareneingang" : "–",
    prozess_wareneingang_bestellung: formValues.pbm1100 ? "PBM1100 – Wareneingang Bestellung" : "–",
    prozess_wareneingang_auftrag: formValues.pbm1200 ? "PBM1200 – Wareneingang Fertigungsauftrag" : "–",
    prozess_wareneingang_retoure_auftrag: formValues.pbm1300 ? "PBM1300 – Retoure (Auftrag)" : "–",
    prozess_wareneingang_retoure_kostenstelle: formValues.pbm1300 ? "PBM1300 – Retoure Kostenstelle" : "–",
    prozess_warenausgang: (formValues.pbm2100 || formValues.pbm2200 || formValues.pbm2300) ? "Warenausgang" : "–",
    prozess_warenausgang_netzplan: formValues.pbm2300 ? "PBM2300 – Warenausgang Netzplan" : "–",
    prozess_warenausgang_auftrag: formValues.pbm2300 ? "PBM2300 – Warenausgang Auftrag" : "–",
    prozess_warenausgang_kostenstelle: formValues.pbm2200 ? "PBM2200 – Warenausgang Kostenstelle" : "–",
    prozess_inventur: formValues.pbm3000 ? "PBM3000 – Inventur" : "–",

    // Movement types - Goods Issue
    bw_warenausgang_auftrag: str(formValues.movement_type_production_order),
    bw_warenausgang_netzplan: str(formValues.movement_type_network_order),
    bw_warenausgang_kostenstelle: str(formValues.movement_type_cost_center),
    bw_warenausgang_reservierung: str(formValues.movement_type_reservation),
    bewegungsart_gi_reservation: str(formValues.movement_type_reservation),

    // Movement types - Goods Receipt
    bw_wareneingang_bestellung: str(formValues.movement_type_gr_po),
    bw_wareneingang_fertigungsauftrag: str(formValues.movement_type_gr_production),
    bewegungsart_gr_production_order: str(formValues.movement_type_gr_production),

    // Movement types - Returns
    bw_wareneingang_retoure_auftrag: str(formValues.movement_type_return_order),
    bw_wareneingang_retoure_kostenstelle: str(formValues.movement_type_return_cost_center),
    bewegungsart_retoure_kostenstelle: str(formValues.movement_type_return_cost_center),

    // Movement types - Transfer
    bw_umlagerung_lagerort: "311",

    // Order rules
    allowed_order_types: str(formValues.allowed_order_types),
    allowed_order_status: str(formValues.allowed_order_status),
    excluded_order_status: str(formValues.excluded_order_status),
    prod_order_status_required: str(formValues.allowed_order_status),
    prod_order_status_excluded: str(formValues.excluded_order_status),
    pm_order_status_required: str(formValues.allowed_order_status),
    pm_order_status_excluded: str(formValues.excluded_order_status),
    nz_order_status_required: str(formValues.allowed_order_status),
    nz_order_status_excluded: str(formValues.excluded_order_status),

    // Inventory
    inventory_doc_types: str(formValues.inventory_doc_types),
    inventory_history_days: str(formValues.inventory_history_days),

    // Mobile
    offline_mode: boolToJaNein(formValues.offline_mode),
    retry_sync: boolToJaNein(formValues.retry_sync),
    receiver_field: boolToJaNein(formValues.receiver_field),
    sync_mode: str(formValues.sync_mode),

    // Additional template-specific placeholders
    loesung_name: str(formValues.project_name),
    mobile_app: "osapiens HUB Mobile App",
    order_type_production: "Fertigungsauftrag",
    production_order_id: "TBD",
    prozess_id: "TBD",
    prozess_name: "TBD",
    cost_center_id: "TBD",
    batch_number: "TBD",
    sled_date: "TBD",
    return_quantity: "TBD",
    entry_quantity: "TBD",
    return_receiver: "TBD",
    receiver_field_length: "12",
    material_document: "TBD",
    material_document_number: "TBD",
    valuation_type: "TBD",
    label_print_quantity: "TBD",
    reservation_number: "TBD",
    reservation_item_number: "TBD",
    requirement_date: "TBD",
    order_id: "TBD",

    // Checkbox features
    label_print_enabled: boolToJaNein(formValues.label_print_enabled),
    batch_managed: boolToJaNein(formValues.batch_managed),
    sled_relevant: boolToJaNein(formValues.sled_relevant),
    hide_deleted_positions: boolToJaNein(formValues.hide_deleted_positions),
  };

  return map;
}

// =====================================================================
// 3. MERGE FRAGMENTED PLACEHOLDERS
//    Word splits text across <w:r> runs. This merges adjacent runs
//    so that {{IF ...}}, {{ENDIF}}, and {{placeholder}} are intact.
// =====================================================================

function mergeFragmentedPlaceholders(xml: string): string {
  let result = xml;
  let changed = true;
  let iterations = 0;

  while (changed && iterations < 30) {
    changed = false;
    iterations++;

    // Find two adjacent runs where combining their <w:t> text completes
    // or helps complete a {{ ... }} pattern
    const pattern =
      /<w:r\b([^>]*)>((?:<w:rPr>.*?<\/w:rPr>)?)<w:t([^>]*)>([^<]*)<\/w:t><\/w:r>(\s*)<w:r\b([^>]*)>((?:<w:rPr>.*?<\/w:rPr>)?)<w:t([^>]*)>([^<]*)<\/w:t><\/w:r>/gs;

    result = result.replace(pattern, (match, a1, rpr1, ta1, t1, space, a2, rpr2, ta2, t2) => {
      const combined = t1 + t2;
      // Merge if the combination contains or progresses toward a placeholder
      if (
        combined.includes("{{") || combined.includes("}}") ||
        combined.includes("IF ") || combined.includes("ENDIF") ||
        (t1.includes("{") && !t1.includes("{{")) ||
        (t1.includes("}") && !t1.includes("}}"))
      ) {
        changed = true;
        const spaceAttr = (combined.startsWith(" ") || combined.endsWith(" "))
          ? ' xml:space="preserve"'
          : ta1;
        return `<w:r${a1}>${rpr1}<w:t${spaceAttr}>${combined}</w:t></w:r>`;
      }
      return match;
    });
  }

  return result;
}

// =====================================================================
// 4. PROCESS CONDITIONAL BLOCKS  {{IF PARAM}} ... {{ENDIF}}
//    Handles nested blocks. Works on raw DOCX XML.
// =====================================================================

function processConditionalBlocks(xml: string, conditions: Record<string, boolean>): string {
  let result = xml;
  let maxIterations = 100;

  while (maxIterations-- > 0) {
    // Find the innermost {{IF ...}} ... {{ENDIF}} pair (no nested IF inside)
    const ifRegex = /\{\{IF\s+(\w+)\}\}/i;
    const match = ifRegex.exec(result);
    if (!match) break;

    const conditionName = match[1];
    const ifTag = match[0];
    const ifStart = match.index;

    // Find matching ENDIF (handle nesting)
    let depth = 1;
    let searchPos = ifStart + ifTag.length;
    let endifPos = -1;
    let endifTag = "{{ENDIF}}";

    while (depth > 0 && searchPos < result.length) {
      const nextIf = result.indexOf("{{IF ", searchPos);
      const nextEndif = result.indexOf("{{ENDIF}}", searchPos);

      if (nextEndif === -1) break; // Unmatched IF — bail

      if (nextIf !== -1 && nextIf < nextEndif) {
        depth++;
        searchPos = nextIf + 5;
      } else {
        depth--;
        if (depth === 0) {
          endifPos = nextEndif;
        }
        searchPos = nextEndif + endifTag.length;
      }
    }

    if (endifPos === -1) {
      // No matching ENDIF — remove the orphan IF tag and continue
      result = result.substring(0, ifStart) + result.substring(ifStart + ifTag.length);
      continue;
    }

    const conditionValue = conditions[conditionName] ?? false;

    if (conditionValue) {
      // TRUE → keep content, remove only the IF and ENDIF tags
      // Remove ENDIF first (later in string)
      result =
        result.substring(0, endifPos) +
        result.substring(endifPos + endifTag.length);
      // Remove IF tag
      result =
        result.substring(0, ifStart) +
        result.substring(ifStart + ifTag.length);
    } else {
      // FALSE → remove everything from the start of the IF-containing paragraph
      //         to the end of the ENDIF-containing paragraph
      const blockStart = findParagraphStart(result, ifStart);
      const blockEnd = findParagraphEnd(result, endifPos + endifTag.length);
      result = result.substring(0, blockStart) + result.substring(blockEnd);
    }
  }

  // Clean up empty paragraphs left behind
  result = cleanEmptyParagraphs(result);

  return result;
}

/** Find the opening <w:p ...> that contains `pos`. */
function findParagraphStart(xml: string, pos: number): number {
  let search = pos;
  while (search > 0) {
    const pStart1 = xml.lastIndexOf("<w:p ", search);
    const pStart2 = xml.lastIndexOf("<w:p>", search);
    const start = Math.max(pStart1, pStart2);
    if (start === -1) return pos;

    // Verify this <w:p> actually encloses our position
    const pEnd = xml.indexOf("</w:p>", start);
    if (pEnd !== -1 && pEnd + 6 >= pos) {
      return start;
    }
    search = start - 1;
  }
  return pos;
}

/** Find the closing </w:p> after `pos` and return the position after it. */
function findParagraphEnd(xml: string, pos: number): number {
  const pEnd = xml.indexOf("</w:p>", pos);
  return pEnd !== -1 ? pEnd + 6 : pos;
}

/** Remove <w:p> elements that contain no text, images, or drawings. */
function cleanEmptyParagraphs(xml: string): string {
  return xml.replace(/<w:p[^>]*>(\s*<w:pPr>.*?<\/w:pPr>)?\s*<\/w:p>/gs, (match) => {
    if (/<w:t[^>]*>.*?<\/w:t>/s.test(match)) return match;
    if (/<w:drawing>|<w:pict>|<mc:AlternateContent>/s.test(match)) return match;
    return "";
  });
}

// =====================================================================
// 5. REPLACE PLACEHOLDERS  {{name}} → value
// =====================================================================

function replacePlaceholdersInXml(xml: string, placeholders: Record<string, string>): string {
  let result = xml;

  for (const [key, value] of Object.entries(placeholders)) {
    const xmlSafe = escapeXml(value);
    const patterns = [
      `{{${key}}}`,
      `{{${key.replace(/_/g, "\\_")}}}`,
    ];
    for (const pattern of patterns) {
      result = result.split(pattern).join(xmlSafe);
    }
  }

  // Replace any remaining unreplaced placeholders with "TBD"
  // (skip IF/ENDIF which are already processed)
  result = result.replace(/\{\{(?!IF\s|ENDIF)([^}]+)\}\}/g, "TBD");

  return result;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// =====================================================================
// 6. MAIN GENERATOR — orchestrates the full pipeline
//    Pipeline: merge runs → process IF/ENDIF → replace placeholders
// =====================================================================

export async function generateDocx(formValues: Record<string, any>, templateFile?: string): Promise<Blob> {
  const file = templateFile || "Blueprint_Template_de_mm.docx";
  const response = await fetch(`/${file}`);
  if (!response.ok) throw new Error(`Template "${file}" konnte nicht geladen werden`);

  const templateBuffer = await response.arrayBuffer();
  const zip = await JSZip.loadAsync(templateBuffer);

  const placeholders = buildPlaceholderMap(formValues);
  const conditions = buildConditionMap(formValues);

  // Collect all XML files to process
  const xmlFiles = new Set([
    "word/document.xml",
    "word/header1.xml",
    "word/header2.xml",
    "word/header3.xml",
    "word/footer1.xml",
    "word/footer2.xml",
    "word/footer3.xml",
    "word/styles.xml",
  ]);

  // Add any additional word/*.xml files
  for (const filePath of Object.keys(zip.files)) {
    if (filePath.startsWith("word/") && filePath.endsWith(".xml")) {
      xmlFiles.add(filePath);
    }
  }

  for (const filePath of xmlFiles) {
    const zipFile = zip.file(filePath);
    if (!zipFile || zip.files[filePath]?.dir) continue;

    let xml = await zipFile.async("string");

    // Step 1: Merge fragmented runs so placeholders are in single <w:t> elements
    xml = mergeFragmentedPlaceholders(xml);

    // Step 2: Process conditional blocks ({{IF PARAM}} ... {{ENDIF}})
    xml = processConditionalBlocks(xml, conditions);

    // Step 3: Replace simple placeholders ({{name}} → value)
    xml = replacePlaceholdersInXml(xml, placeholders);

    zip.file(filePath, xml);
  }

  const output = await zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  return output;
}
