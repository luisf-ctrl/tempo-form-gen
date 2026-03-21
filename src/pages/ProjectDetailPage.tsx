import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/StatusBadge";
import { DynamicForm } from "@/components/DynamicForm";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Save,
  FileText,
  CheckSquare,
  Settings2,
  LayoutDashboard,
  Calendar,
  Download,
  FilePlus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { getProject, updateProjectParameters, updateChecklist } from "@/lib/projectStore";
import { projectParametersConfig } from "@/data/projectParametersConfig";
import { documentTemplates, formatLabels, formatColors, documentTypeLabels } from "@/data/documentTemplateRegistry";
import { solutionAreaLabels } from "@/data/solutionAreas";
import { categoryLabels, categoryColors } from "@/lib/checklistGenerator";
import type { Project, ChecklistItem, ProjectParameters } from "@/types";
import { cn } from "@/lib/utils";

function flattenParams(params: ProjectParameters): Record<string, any> {
  const flat: Record<string, any> = {};
  for (const [section, values] of Object.entries(params)) {
    for (const [key, val] of Object.entries(values as Record<string, any>)) {
      flat[`${section}.${key}`] = val;
    }
  }
  return flat;
}

function unflattenParams(flat: Record<string, any>): ProjectParameters {
  const result: any = {};
  for (const [key, val] of Object.entries(flat)) {
    const [section, field] = key.split(".");
    if (!section || !field) continue;
    if (!result[section]) result[section] = {};
    result[section][field] = val;
  }
  return result as ProjectParameters;
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!id) return;
    const p = getProject(id);
    if (p) {
      setProject(p);
      setParamValues(flattenParams(p.parameters));
    }
  }, [id]);

  const handleParamChange = useCallback((fieldId: string, value: any) => {
    setParamValues((prev) => ({ ...prev, [fieldId]: value }));
    setHasChanges(true);
  }, []);

  const handleSaveParams = () => {
    if (!project) return;
    const params = unflattenParams(paramValues);
    updateProjectParameters(project.id, params);
    setProject({ ...project, parameters: params, name: params.projektdaten.name || project.name, client: params.organisationen.auftraggeber || project.client });
    setHasChanges(false);
  };

  const handleChecklistToggle = (itemId: string) => {
    if (!project) return;
    const updated = project.checklist.map((item) =>
      item.id === itemId
        ? { ...item, completed: !item.completed, completedAt: !item.completed ? new Date().toISOString() : undefined }
        : item
    );
    updateChecklist(project.id, updated);
    const total = updated.length;
    const done = updated.filter((c) => c.completed).length;
    setProject({ ...project, checklist: updated, progress: total > 0 ? Math.round((done / total) * 100) : 0 });
  };

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground text-sm mb-4">Projekt nicht gefunden</p>
        <Button variant="outline" size="sm" onClick={() => navigate("/projects")} className="rounded-lg">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Zurück zu Projekten
        </Button>
      </div>
    );
  }

  const areaTemplates = documentTemplates.filter((t) =>
    t.applicableAreas.includes(project.solutionArea)
  );

  const checklistByCategory = project.checklist.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const totalChecklist = project.checklist.length;
  const completedChecklist = project.checklist.filter((c) => c.completed).length;

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/projects")} className="h-8 w-8 rounded-lg">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium mb-1">
              {solutionAreaLabels[project.solutionArea]}
            </p>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-heading font-bold tracking-tight">{project.name}</h1>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-muted-foreground text-sm mt-0.5">{project.client}</p>
          </div>
        </div>
        <Button asChild size="sm" className="rounded-lg h-9">
          <Link to={`/generate?project=${project.id}`}>
            <FilePlus className="mr-1.5 h-3.5 w-3.5" /> Dokument generieren
          </Link>
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border/60">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Fortschritt</p>
          <div className="flex items-center gap-3 mt-2">
            <Progress value={project.progress} className="h-1 flex-1" />
            <span className="text-sm font-bold font-heading">{project.progress}%</span>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border/60">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Checkliste</p>
          <p className="text-xl font-bold font-heading mt-1">{completedChecklist}/{totalChecklist}</p>
        </div>
        <div className="p-4 rounded-xl border border-border/60">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Dokumente</p>
          <p className="text-xl font-bold font-heading mt-1">{project.generatedDocuments.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-border/60">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Erstellt</p>
          <p className="text-xl font-bold font-heading mt-1">{project.createdAt}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-lg h-9 rounded-lg bg-secondary/50">
          <TabsTrigger value="overview" className="gap-1.5 text-xs rounded-md">
            <LayoutDashboard className="h-3.5 w-3.5" /> Übersicht
          </TabsTrigger>
          <TabsTrigger value="parameters" className="gap-1.5 text-xs rounded-md">
            <Settings2 className="h-3.5 w-3.5" /> Parameter
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-1.5 text-xs rounded-md">
            <FileText className="h-3.5 w-3.5" /> Dokumente
          </TabsTrigger>
          <TabsTrigger value="checklist" className="gap-1.5 text-xs rounded-md">
            <CheckSquare className="h-3.5 w-3.5" /> Checkliste
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border/60 p-6">
              <h3 className="font-heading font-semibold text-sm tracking-tight mb-4">Projektdaten</h3>
              <div className="space-y-3">
                <InfoRow label="Projektname" value={project.parameters.projektdaten.name} />
                <InfoRow label="Projektkürzel" value={project.parameters.projektdaten.kuerzel} />
                <InfoRow label="Projekttyp" value={project.parameters.projektdaten.typ} />
                <InfoRow label="Auftraggeber" value={project.parameters.organisationen.auftraggeber} />
                <InfoRow label="Implementierungspartner" value={project.parameters.organisationen.implementierungspartner} />
                {project.parameters.projektdaten.beschreibung && (
                  <div className="pt-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Beschreibung</p>
                    <p className="text-sm leading-relaxed">{project.parameters.projektdaten.beschreibung}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border/60 p-6">
              <h3 className="font-heading font-semibold text-sm tracking-tight mb-4">Schlüsseltermine</h3>
              <div className="space-y-3">
                <InfoRow label="Projektstart" value={project.parameters.schluesseltermine.projektstart} />
                <InfoRow label="Ende Prepare" value={project.parameters.schluesseltermine.endePrepare} />
                <InfoRow label="Ende Explore" value={project.parameters.schluesseltermine.endeExplore} />
                <InfoRow label="Ende Realize" value={project.parameters.schluesseltermine.endeRealize} />
                <InfoRow label="Go-Live" value={project.parameters.schluesseltermine.goLive} />
                <InfoRow label="Ende Hypercare" value={project.parameters.schluesseltermine.endeHypercare} />
                <InfoRow label="Projektende" value={project.parameters.schluesseltermine.projektende} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Parameters Tab */}
        <TabsContent value="parameters">
          <div className="rounded-xl border border-border/60 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-semibold text-sm tracking-tight">Projekt-Parameter</h3>
              {hasChanges && (
                <Button onClick={handleSaveParams} size="sm" className="rounded-lg h-8 text-xs">
                  <Save className="mr-1.5 h-3.5 w-3.5" /> Speichern
                </Button>
              )}
            </div>
            <DynamicForm
              config={projectParametersConfig}
              values={paramValues}
              onChange={handleParamChange}
            />
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {areaTemplates.map((tpl) => {
              const generated = project.generatedDocuments.filter((d) => d.type === tpl.type);
              const latestDoc = generated[generated.length - 1];
              return (
                <div key={tpl.id} className="p-5 rounded-xl border border-border/60 hover:border-foreground/15 transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">{tpl.label}</h3>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                          {formatLabels[tpl.format]}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{tpl.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
                    {latestDoc ? (
                      <div className="flex items-center gap-2">
                        <StatusBadge status={latestDoc.status} />
                        <span className="text-[10px] text-muted-foreground">{latestDoc.createdAt}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">Noch nicht generiert</span>
                    )}
                    <div className="flex gap-2">
                      {latestDoc && (
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild className="rounded-lg h-7 text-[10px] px-3">
                        <Link to={`/generate?project=${project.id}&type=${tpl.type}`}>
                          <FilePlus className="mr-1 h-3 w-3" />
                          {latestDoc ? "Neu" : "Generieren"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Checklist Tab */}
        <TabsContent value="checklist">
          <div className="rounded-xl border border-border/60 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-semibold text-sm tracking-tight">Projekt-Checkliste</h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{completedChecklist} von {totalChecklist}</span>
                <Progress value={project.progress} className="w-24 h-1" />
              </div>
            </div>
            <div className="space-y-3">
              {(["prepare", "explore", "realize", "deploy", "run"] as const).map((cat) => {
                const items = checklistByCategory[cat] || [];
                if (items.length === 0) return null;
                const catDone = items.filter((i) => i.completed).length;
                const isCollapsed = collapsedCategories[cat];

                return (
                  <div key={cat} className="border border-border/60 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className="flex items-center justify-between w-full p-3.5 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        <span className="text-xs font-medium uppercase tracking-wider">{categoryLabels[cat]}</span>
                        <span className="text-[10px] text-muted-foreground">{catDone}/{items.length}</span>
                      </div>
                      <Progress value={items.length > 0 ? (catDone / items.length) * 100 : 0} className="w-20 h-1" />
                    </button>
                    {!isCollapsed && (
                      <div className="border-t border-border/40 divide-y divide-border/40">
                        {items.map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/20 cursor-pointer transition-colors"
                          >
                            <Checkbox
                              checked={item.completed}
                              onCheckedChange={() => handleChecklistToggle(item.id)}
                            />
                            <span className={cn("text-sm flex-1", item.completed && "line-through text-muted-foreground")}>
                              {item.label}
                            </span>
                            {item.linkedDocumentType && (
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                {documentTypeLabels[item.linkedDocumentType]}
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>
  );
}
