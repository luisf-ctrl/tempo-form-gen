import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DynamicForm } from "@/components/DynamicForm";
import {
  blueprintFormConfig,
  blueprintWizardSteps,
  stepSectionMap,
  PROCESS_LABELS,
} from "@/data/blueprintFormConfig";
import { generateDocx } from "@/lib/docxGenerator";
import { getProjects, getProject, addGeneratedDocument, buildProjectPlaceholderMap } from "@/lib/projectStore";
import { documentTemplates, formatLabels, formatColors, documentTypeLabels } from "@/data/documentTemplateRegistry";
import { solutionAreas, solutionAreaLabels } from "@/data/solutionAreas";
import {
  ChevronRight,
  ChevronLeft,
  FileText,
  Loader2,
  CheckCircle2,
  Download,
  FolderOpen,
  Server,
  Building2,
  GitBranch,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Check,
  ArrowLeft,
  FilePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { FormConfig, Project, DocumentTemplateType, GeneratedDocument } from "@/types";

const stepIcons = [
  FolderOpen, Server, Building2, GitBranch, SlidersHorizontal, Smartphone, Sparkles,
];

export default function GeneratePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const projectIdFromUrl = searchParams.get("project");
  const typeFromUrl = searchParams.get("type") as DocumentTemplateType | null;

  // State
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projectIdFromUrl);
  const [selectedDocTypes, setSelectedDocTypes] = useState<DocumentTemplateType[]>(
    typeFromUrl ? [typeFromUrl] : []
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null);

  const projects = useMemo(() => getProjects(), []);
  const project = selectedProjectId ? getProject(selectedProjectId) : null;

  const areaTemplates = project
    ? documentTemplates.filter((t) => t.applicableAreas.includes(project.solutionArea))
    : [];

  // If project changes, pre-fill form values from project parameters
  useEffect(() => {
    if (project) {
      const placeholders = buildProjectPlaceholderMap(project);
      setFormValues((prev) => ({ ...prev, ...placeholders }));
    }
  }, [selectedProjectId]);

  const totalSteps = blueprintWizardSteps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const needsBlueprintWizard = selectedDocTypes.includes("blueprint") || selectedDocTypes.includes("customizing_plan");

  const handleFormChange = (id: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  const currentStepConfig = useMemo((): FormConfig | null => {
    const sectionIds = stepSectionMap[currentStep];
    if (!sectionIds) return null;
    return {
      sections: blueprintFormConfig.sections.filter((s) => sectionIds.includes(s.id)),
      fields: blueprintFormConfig.fields.filter((f) => sectionIds.includes(f.section)),
    };
  }, [currentStep]);

  const validateCurrentStep = () => {
    if (currentStep === totalSteps - 1) return true;
    const sectionIds = stepSectionMap[currentStep];
    if (!sectionIds) return true;
    const requiredFields = blueprintFormConfig.fields.filter(
      (f) => sectionIds.includes(f.section) && f.required
    );
    const newErrors: Record<string, string> = {};
    requiredFields.forEach((f) => {
      if (!formValues[f.id] && formValues[f.id] !== 0 && formValues[f.id] !== false) {
        newErrors[f.id] = "Pflichtfeld";
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({ title: "Bitte füllen Sie alle Pflichtfelder aus", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < totalSteps - 1) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const toggleDocType = (type: DocumentTemplateType) => {
    setSelectedDocTypes((prev) =>
      prev.includes(type) ? prev.filter((d) => d !== type) : [...prev, type]
    );
  };

  const handleGenerate = async () => {
    if (selectedDocTypes.length === 0) {
      toast({ title: "Bitte wählen Sie mindestens ein Dokument", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    try {
      // For now, generate blueprint DOCX if selected
      const blueprintType = selectedDocTypes.find((t) => t === "blueprint");
      if (blueprintType) {
        const tpl = documentTemplates.find((t) => t.type === "blueprint");
        const templateFile = tpl?.templateFiles.de;
        const blob = await generateDocx(formValues, templateFile);
        setGeneratedBlob(blob);

        if (project) {
          const doc: GeneratedDocument = {
            id: `d-${Date.now()}`,
            name: `Blueprint - ${project.name}`,
            type: "blueprint",
            version: "1.0",
            status: "generated",
            createdAt: new Date().toISOString().slice(0, 10),
            projectId: project.id,
            size: `${(blob.size / 1024).toFixed(0)} KB`,
            format: "docx",
          };
          addGeneratedDocument(project.id, doc);
        }
      }
      setIsComplete(true);
    } catch (error) {
      console.error("Generation failed:", error);
      toast({ title: "Fehler bei der Generierung", description: String(error), variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedBlob) return;
    const url = URL.createObjectURL(generatedBlob);
    const link = document.createElement("a");
    link.href = url;
    const safeName = (project?.name || "Projekt").replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, "_").substring(0, 50);
    link.download = `Blueprint_${safeName}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSelectedProjectId(null);
    setSelectedDocTypes([]);
    setCurrentStep(0);
    setFormValues({});
    setIsComplete(false);
    setGeneratedBlob(null);
    setErrors({});
  };

  // ===== STEP 0: PROJECT SELECTION =====
  if (!selectedProjectId || !project) {
    return (
      <div className="animate-fade-in max-w-5xl mx-auto pb-12">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-card border px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Dokument generieren
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Projekt auswählen
          </h1>
          <p className="text-muted-foreground mt-2 text-base max-w-xl">
            Wählen Sie ein Projekt, für das Sie Dokumente generieren möchten.
          </p>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-16">
              <FolderOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-4">Noch keine Projekte vorhanden</p>
              <Button asChild>
                <Link to="/projects">
                  <FilePlus className="mr-2 h-4 w-4" /> Projekt anlegen
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((p) => {
              const areaConfig = solutionAreas.find((a) => a.id === p.solutionArea);
              const Icon = areaConfig?.icon || FolderOpen;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className="group relative flex flex-col p-6 rounded-3xl border bg-card text-left transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", areaConfig?.color || "bg-muted")}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold">{p.name}</h3>
                      <p className="text-xs text-muted-foreground">{p.client}</p>
                    </div>
                  </div>
                  {areaConfig && (
                    <Badge variant="outline" className={cn("text-xs w-fit mb-2", areaConfig.color)}>
                      {areaConfig.label}
                    </Badge>
                  )}
                  {p.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                  )}
                  <ChevronRight className="absolute top-6 right-6 h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ===== STEP 1: DOCUMENT TYPE SELECTION =====
  if (selectedDocTypes.length === 0 && !isComplete) {
    const areaConfig = solutionAreas.find((a) => a.id === project.solutionArea);
    return (
      <div className="animate-fade-in max-w-5xl mx-auto pb-12">
        <div className="mb-10">
          <button
            onClick={() => setSelectedProjectId(null)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Projekt wechseln
          </button>
          <div className="flex items-center gap-3 mb-2">
            {areaConfig && (
              <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center", areaConfig.color)}>
                <areaConfig.icon className="h-4 w-4" />
              </div>
            )}
            <div className="inline-flex items-center gap-2 rounded-full bg-card border px-3 py-1 text-xs font-medium text-muted-foreground">
              {project.name}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Dokumente auswählen
          </h1>
          <p className="text-muted-foreground mt-2 text-base max-w-xl">
            Welche Dokumente möchten Sie für <span className="font-medium text-foreground">{project.name}</span> generieren?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {areaTemplates.map((tpl) => {
            const isSelected = selectedDocTypes.includes(tpl.type);
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => toggleDocType(tpl.type)}
                className={cn(
                  "flex items-start gap-4 p-5 rounded-2xl border text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "hover:bg-secondary/50 hover:shadow-sm"
                )}
              >
                <div className={cn(
                  "mt-0.5 h-5 w-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors",
                  isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
                )}>
                  {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{tpl.label}</p>
                    <Badge variant="outline" className={cn("text-xs", formatColors[tpl.format])}>
                      {formatLabels[tpl.format]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{tpl.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {selectedDocTypes.length > 0 && (
          <div className="flex justify-end">
            <Button
              onClick={() => {
                if (needsBlueprintWizard) {
                  setCurrentStep(0);
                } else {
                  handleGenerate();
                }
              }}
              className="rounded-2xl px-8"
            >
              {needsBlueprintWizard ? (
                <>Weiter konfigurieren <ChevronRight className="ml-2 h-4 w-4" /></>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Generieren
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // ===== GENERATING =====
  if (isGenerating) {
    return (
      <div className="animate-fade-in max-w-5xl mx-auto pb-12">
        <div className="rounded-3xl bg-card border shadow-sm overflow-hidden">
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-2 border-border" />
              <Loader2 className="h-16 w-16 text-primary animate-spin absolute inset-0" />
            </div>
            <p className="font-heading font-semibold text-xl mt-6">Dokumente werden generiert...</p>
            <p className="text-sm text-muted-foreground mt-2">{project.name}</p>
          </div>
        </div>
      </div>
    );
  }

  // ===== COMPLETE =====
  if (isComplete) {
    return (
      <div className="animate-fade-in max-w-5xl mx-auto pb-12">
        <div className="rounded-3xl bg-card border shadow-sm overflow-hidden p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-4">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h2 className="font-heading font-bold text-2xl">Erfolgreich generiert!</h2>
            <p className="text-muted-foreground mt-2">
              {selectedDocTypes.length} Dokument(e) für {project.name} erstellt
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {selectedDocTypes.map((type) => {
              const tpl = documentTemplates.find((t) => t.type === type);
              return (
                <div key={type} className="flex items-center justify-between p-5 rounded-2xl border bg-secondary/30">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{tpl?.label || type}</p>
                      <p className="text-xs text-muted-foreground">
                        v1.0 · {project.name} · {new Date().toLocaleDateString("de-DE")} · {tpl?.format.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  {generatedBlob && type === "blueprint" && (
                    <Button variant="outline" size="sm" className="rounded-xl" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" onClick={() => navigate(`/projects/${project.id}`)} className="rounded-2xl px-6">
              <ArrowLeft className="mr-2 h-4 w-4" /> Zum Projekt
            </Button>
            <Button onClick={handleReset} className="rounded-2xl px-6">
              <Sparkles className="mr-2 h-4 w-4" /> Neues Dokument
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ===== BLUEPRINT WIZARD (for docs that need technical config) =====
  const activeProcessCount = PROCESS_LABELS.filter(([key]) => formValues[key]).length;

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-12">
      <div className="mb-10">
        <button
          onClick={() => { setSelectedDocTypes([]); setCurrentStep(0); }}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Dokumentauswahl
        </button>
        <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
          Konfigurieren & Generieren
        </h1>
        <p className="text-muted-foreground mt-2 text-base max-w-xl">
          Technische Details für {project.name} konfigurieren.
        </p>
      </div>

      {/* Steps Navigation */}
      <div className="mb-8">
        <div className="flex items-center gap-0 overflow-x-auto pb-2">
          {blueprintWizardSteps.map((step, i) => {
            const Icon = stepIcons[i];
            const isActive = i === currentStep;
            const isDone = i < currentStep;
            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => { if (isDone) setCurrentStep(i); }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all whitespace-nowrap",
                    isActive && "bg-primary text-primary-foreground shadow-lg shadow-primary/20",
                    isDone && "bg-card border text-foreground cursor-pointer hover:shadow-md",
                    !isActive && !isDone && "text-muted-foreground"
                  )}
                >
                  {isDone ? (
                    <div className="h-5 w-5 rounded-full bg-success flex items-center justify-center">
                      <Check className="h-3 w-3 text-success-foreground" />
                    </div>
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <span className="hidden lg:inline">{step.label}</span>
                </button>
                {i < blueprintWizardSteps.length - 1 && (
                  <div className={cn("w-6 h-px mx-1 hidden md:block", isDone ? "bg-success" : "bg-border")} />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 h-1 w-full rounded-full bg-secondary overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="rounded-3xl bg-card border shadow-sm overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                {(() => { const Icon = stepIcons[currentStep]; return <Icon className="h-4 w-4 text-primary" />; })()}
              </div>
              <h2 className="font-heading font-semibold text-xl">{blueprintWizardSteps[currentStep].label}</h2>
            </div>
            <p className="text-sm text-muted-foreground ml-11">{blueprintWizardSteps[currentStep].description}</p>
          </div>

          {/* Form steps 0-5 */}
          {currentStep <= 5 && currentStepConfig && (
            <DynamicForm config={currentStepConfig} values={formValues} onChange={handleFormChange} errors={errors} />
          )}

          {/* Step 6: Generate */}
          {currentStep === 6 && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-2xl border bg-secondary/30 p-4 text-center">
                  <p className="text-2xl font-heading font-bold">{activeProcessCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">Prozesse aktiv</p>
                </div>
                <div className="rounded-2xl border bg-secondary/30 p-4 text-center">
                  <p className="text-2xl font-heading font-bold">{formValues.number_of_materials || "–"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Materialien</p>
                </div>
                <div className="rounded-2xl border bg-secondary/30 p-4 text-center">
                  <p className="text-2xl font-heading font-bold">{formValues.number_of_storage_locations || "–"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Lagerorte</p>
                </div>
                <div className="rounded-2xl border bg-secondary/30 p-4 text-center">
                  <p className="text-2xl font-heading font-bold">{selectedDocTypes.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Dokumente</p>
                </div>
              </div>

              <div className="rounded-2xl border bg-secondary/30 p-5">
                <p className="text-sm font-medium mb-3">Ausgewählte Dokumente</p>
                <div className="flex flex-wrap gap-2">
                  {selectedDocTypes.map((type) => {
                    const tpl = documentTemplates.find((t) => t.type === type);
                    return (
                      <span key={type} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm font-medium">
                        <Check className="h-3 w-3" />
                        {tpl?.label || documentTypeLabels[type] || type}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button size="lg" onClick={handleGenerate} className="rounded-2xl px-10 h-12 text-base shadow-lg shadow-primary/20">
                  <Sparkles className="mr-2 h-5 w-5" /> Dokumente generieren
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleBack} className="rounded-2xl px-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Zurück
        </Button>
        {currentStep < totalSteps - 1 && (
          <Button onClick={handleNext} className="rounded-2xl px-6">
            Weiter <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
