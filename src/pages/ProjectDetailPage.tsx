import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// Helper: flatten nested parameters to dot-notation for DynamicForm
function flattenParams(params: ProjectParameters): Record<string, any> {
  const flat: Record<string, any> = {};
  for (const [section, values] of Object.entries(params)) {
    for (const [key, val] of Object.entries(values as Record<string, any>)) {
      flat[`${section}.${key}`] = val;
    }
  }
  return flat;
}

// Helper: unflatten dot-notation values back to nested structure
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
        <p className="text-muted-foreground mb-4">Projekt nicht gefunden</p>
        <Button variant="outline" onClick={() => navigate("/projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zu Projekten
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/projects")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-heading font-bold">{project.name}</h1>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-muted-foreground mt-1">
              {project.client} · {solutionAreaLabels[project.solutionArea]}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/generate?project=${project.id}`}>
            <FilePlus className="mr-2 h-4 w-4" /> Dokument generieren
          </Link>
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Fortschritt</p>
            <div className="flex items-center gap-3 mt-1">
              <Progress value={project.progress} className="h-2 flex-1" />
              <span className="text-sm font-bold">{project.progress}%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Checkliste</p>
            <p className="text-xl font-bold mt-1">{completedChecklist}/{totalChecklist}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Generierte Dokumente</p>
            <p className="text-xl font-bold mt-1">{project.generatedDocuments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Erstellt am</p>
            <p className="text-xl font-bold mt-1">{project.createdAt}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-lg">
          <TabsTrigger value="overview" className="gap-1.5">
            <LayoutDashboard className="h-4 w-4" /> Übersicht
          </TabsTrigger>
          <TabsTrigger value="parameters" className="gap-1.5">
            <Settings2 className="h-4 w-4" /> Parameter
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-1.5">
            <FileText className="h-4 w-4" /> Dokumente
          </TabsTrigger>
          <TabsTrigger value="checklist" className="gap-1.5">
            <CheckSquare className="h-4 w-4" /> Checkliste
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-heading">Projektdaten</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Projektname" value={project.parameters.projektdaten.name} />
                <InfoRow label="Projektkürzel" value={project.parameters.projektdaten.kuerzel} />
                <InfoRow label="Projekttyp" value={project.parameters.projektdaten.typ} />
                <InfoRow label="Auftraggeber" value={project.parameters.organisationen.auftraggeber} />
                <InfoRow label="Implementierungspartner" value={project.parameters.organisationen.implementierungspartner} />
                {project.parameters.projektdaten.beschreibung && (
                  <div>
                    <p className="text-sm text-muted-foreground">Beschreibung</p>
                    <p className="text-sm mt-0.5">{project.parameters.projektdaten.beschreibung}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-heading">Schlüsseltermine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Projektstart" value={project.parameters.schluesseltermine.projektstart} icon={<Calendar className="h-3.5 w-3.5" />} />
                <InfoRow label="Ende Prepare" value={project.parameters.schluesseltermine.endePrepare} />
                <InfoRow label="Ende Explore" value={project.parameters.schluesseltermine.endeExplore} />
                <InfoRow label="Ende Realize" value={project.parameters.schluesseltermine.endeRealize} />
                <InfoRow label="Go-Live" value={project.parameters.schluesseltermine.goLive} icon={<Calendar className="h-3.5 w-3.5 text-primary" />} />
                <InfoRow label="Ende Hypercare" value={project.parameters.schluesseltermine.endeHypercare} />
                <InfoRow label="Projektende" value={project.parameters.schluesseltermine.projektende} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Parameters Tab */}
        <TabsContent value="parameters">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-heading">Projekt-Parameter</CardTitle>
              {hasChanges && (
                <Button onClick={handleSaveParams}>
                  <Save className="mr-2 h-4 w-4" /> Speichern
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <DynamicForm
                config={projectParametersConfig}
                values={paramValues}
                onChange={handleParamChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {areaTemplates.map((tpl) => {
              const generated = project.generatedDocuments.filter((d) => d.type === tpl.type);
              const latestDoc = generated[generated.length - 1];
              return (
                <Card key={tpl.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm">{tpl.label}</h3>
                          <Badge variant="outline" className={cn("text-xs", formatColors[tpl.format])}>
                            {formatLabels[tpl.format]}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{tpl.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t">
                      {latestDoc ? (
                        <div className="flex items-center gap-2">
                          <StatusBadge status={latestDoc.status} />
                          <span className="text-xs text-muted-foreground">{latestDoc.createdAt}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Noch nicht generiert</span>
                      )}
                      <div className="flex gap-2">
                        {latestDoc && (
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/generate?project=${project.id}&type=${tpl.type}`}>
                            <FilePlus className="mr-1 h-3.5 w-3.5" />
                            {latestDoc ? "Neu" : "Generieren"}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Checklist Tab */}
        <TabsContent value="checklist">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-heading">Projekt-Checkliste</CardTitle>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{completedChecklist} von {totalChecklist} erledigt</span>
                  <Progress value={project.progress} className="w-32 h-2" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {(["prepare", "explore", "realize", "deploy", "run"] as const).map((cat) => {
                const items = checklistByCategory[cat] || [];
                if (items.length === 0) return null;
                const catDone = items.filter((i) => i.completed).length;
                const isCollapsed = collapsedCategories[cat];

                return (
                  <div key={cat} className="border rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className="flex items-center justify-between w-full p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        <Badge variant="secondary" className={cn("text-xs", categoryColors[cat])}>
                          {categoryLabels[cat]}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{catDone}/{items.length}</span>
                      </div>
                      <Progress value={items.length > 0 ? (catDone / items.length) * 100 : 0} className="w-24 h-1.5" />
                    </button>
                    {!isCollapsed && (
                      <div className="border-t divide-y">
                        {items.map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 cursor-pointer transition-colors"
                          >
                            <Checkbox
                              checked={item.completed}
                              onCheckedChange={() => handleChecklistToggle(item.id)}
                            />
                            <span className={cn("text-sm flex-1", item.completed && "line-through text-muted-foreground")}>
                              {item.label}
                            </span>
                            {item.linkedDocumentType && (
                              <Badge variant="outline" className="text-xs">
                                {documentTypeLabels[item.linkedDocumentType]}
                              </Badge>
                            )}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>
  );
}
