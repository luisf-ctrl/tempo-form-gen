import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium mb-3">Generieren</p>
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Projekt auswählen
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Wählen Sie ein Projekt, für das Sie Dokumente generieren möchten.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-border/60 p-16 text-center">
            <FolderOpen className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm mb-4">Noch keine Projekte vorhanden</p>
            <Button asChild size="sm" className="rounded-lg">
              <Link to="/projects">
                <FilePlus className="mr-1.5 h-3.5 w-3.5" /> Projekt anlegen
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projects.map((p) => {
              const areaConfig = solutionAreas.find((a) => a.id === p.solutionArea);
              const Icon = areaConfig?.icon || FolderOpen;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className="group relative flex flex-col p-5 rounded-xl border border-border/60 bg-card text-left transition-all hover:border-foreground/15"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center">
                      <Icon className="h-4 w-4 text-foreground/60" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-sm tracking-tight">{p.name}</h3>
                      <p className="text-[11px] text-muted-foreground">{p.client}</p>
                    </div>
                  </div>
                  {areaConfig && (
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">
                      {areaConfig.label}
                    </p>
                  )}
                  {p.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{p.description}</p>
                  )}
                  <ChevronRight className="absolute top-5 right-5 h-4 w-4 text-muted-foreground/30 group-hover:text-foreground/40 transition-colors" />
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
    return (
      <div className="animate-fade-in max-w-5xl mx-auto pb-12">
        <div className="mb-10">
          <button
            onClick={() => setSelectedProjectId(null)}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Projekt wechseln
          </button>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
              {project.name}
            </p>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Dokumente auswählen
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Welche Dokumente möchten Sie generieren?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {areaTemplates.map((tpl) => {
            const isSelected = selectedDocTypes.includes(tpl.type);
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => toggleDocType(tpl.type)}
                className={cn(
                  "flex items-start gap-4 p-5 rounded-xl border text-left transition-all",
                  isSelected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border/60 hover:border-foreground/15"
                )}
              >
                <div className={cn(
                  "mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                  isSelected ? "border-background bg-background" : "border-muted-foreground/30"
                )}>
                  {isSelected && <Check className="h-3 w-3 text-foreground" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{tpl.label}</p>
                    <span className={cn(
                      "text-[10px] uppercase tracking-wider font-medium",
                      isSelected ? "text-background/60" : "text-muted-foreground"
                    )}>
                      {formatLabels[tpl.format]}
                    </span>
                  </div>
                  <p className={cn("text-xs mt-1 leading-relaxed", isSelected ? "text-background/70" : "text-muted-foreground")}>
                    {tpl.description}
                  </p>
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
              size="sm"
              className="rounded-lg h-9 px-6"
            >
              {needsBlueprintWizard ? (
                <>Weiter konfigurieren <ChevronRight className="ml-1.5 h-3.5 w-3.5" /></>
              ) : (
                <>
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Generieren
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
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-8 w-8 text-foreground animate-spin" />
            <p className="font-heading font-semibold text-lg mt-6 tracking-tight">Dokumente werden generiert...</p>
            <p className="text-xs text-muted-foreground mt-1">{project.name}</p>
          </div>
        </div>
      </div>
    );
  }

  // ===== COMPLETE =====
  if (isComplete) {
    return (
      <div className="animate-fade-in max-w-5xl mx-auto pb-12">
        <div className="rounded-xl border border-border/60 overflow-hidden p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/10 mb-4">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <h2 className="font-heading font-bold text-2xl tracking-tight">Erfolgreich generiert</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {selectedDocTypes.length} Dokument(e) für {project.name}
            </p>
          </div>

          <div className="space-y-2 mb-8">
            {selectedDocTypes.map((type) => {
              const tpl = documentTemplates.find((t) => t.type === type);
              return (
                <div key={type} className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-secondary/20">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{tpl?.label || type}</p>
                      <p className="text-[10px] text-muted-foreground">
                        v1.0 · {new Date().toLocaleDateString("de-DE")} · {tpl?.format.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  {generatedBlob && type === "blueprint" && (
                    <Button variant="outline" size="sm" className="rounded-lg h-8 text-xs" onClick={handleDownload}>
                      <Download className="mr-1.5 h-3.5 w-3.5" /> Download
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-3 mt-8">
            <Button variant="outline" onClick={() => navigate(`/projects/${project.id}`)} size="sm" className="rounded-lg h-9 px-5">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Zum Projekt
            </Button>
            <Button onClick={handleReset} size="sm" className="rounded-lg h-9 px-5">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Neues Dokument
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ===== BLUEPRINT WIZARD =====
  const activeProcessCount = PROCESS_LABELS.filter(([key]) => formValues[key]).length;

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <button
          onClick={() => { setSelectedDocTypes([]); setCurrentStep(0); }}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Dokumentauswahl
        </button>
        <h1 className="text-3xl font-heading font-bold tracking-tight">
          Konfigurieren & Generieren
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
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
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                    isActive && "bg-foreground text-background",
                    isDone && "bg-secondary text-foreground cursor-pointer hover:bg-secondary/80",
                    !isActive && !isDone && "text-muted-foreground"
                  )}
                >
                  {isDone ? (
                    <div className="h-4 w-4 rounded-full bg-success flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-success-foreground" />
                    </div>
                  ) : (
                    <Icon className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden lg:inline">{step.label}</span>
                </button>
                {i < blueprintWizardSteps.length - 1 && (
                  <div className={cn("w-6 h-px mx-1 hidden md:block", isDone ? "bg-foreground/20" : "bg-border")} />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 h-0.5 w-full rounded-full bg-secondary overflow-hidden">
          <div className="h-full rounded-full bg-foreground transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-1.5">
              <div className="h-7 w-7 rounded-md bg-secondary flex items-center justify-center">
                {(() => { const Icon = stepIcons[currentStep]; return <Icon className="h-3.5 w-3.5 text-foreground/60" />; })()}
              </div>
              <h2 className="font-heading font-semibold text-lg tracking-tight">{blueprintWizardSteps[currentStep].label}</h2>
            </div>
            <p className="text-xs text-muted-foreground ml-10">{blueprintWizardSteps[currentStep].description}</p>
          </div>

          {/* Form steps 0-5 */}
          {currentStep <= 5 && currentStepConfig && (
            <DynamicForm config={currentStepConfig} values={formValues} onChange={handleFormChange} errors={errors} />
          )}

          {/* Step 6: Generate */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-xl border border-border/60 p-4 text-center">
                  <p className="text-2xl font-heading font-bold tracking-tight">{activeProcessCount}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">Prozesse</p>
                </div>
                <div className="rounded-xl border border-border/60 p-4 text-center">
                  <p className="text-2xl font-heading font-bold tracking-tight">{formValues.number_of_materials || "–"}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">Materialien</p>
                </div>
                <div className="rounded-xl border border-border/60 p-4 text-center">
                  <p className="text-2xl font-heading font-bold tracking-tight">{formValues.number_of_storage_locations || "–"}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">Lagerorte</p>
                </div>
                <div className="rounded-xl border border-border/60 p-4 text-center">
                  <p className="text-2xl font-heading font-bold tracking-tight">{selectedDocTypes.length}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">Dokumente</p>
                </div>
              </div>

              <div className="rounded-xl border border-border/60 p-5">
                <p className="text-xs font-medium mb-3 uppercase tracking-wider text-muted-foreground">Ausgewählte Dokumente</p>
                <div className="flex flex-wrap gap-2">
                  {selectedDocTypes.map((type) => {
                    const tpl = documentTemplates.find((t) => t.type === type);
                    return (
                      <span key={type} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium">
                        <Check className="h-3 w-3" />
                        {tpl?.label || documentTypeLabels[type] || type}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button onClick={handleGenerate} className="rounded-lg h-10 px-8 text-sm">
                  <Sparkles className="mr-2 h-4 w-4" /> Dokumente generieren
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleBack} size="sm" className="rounded-lg h-9 px-5">
          <ChevronLeft className="mr-1.5 h-3.5 w-3.5" /> Zurück
        </Button>
        {currentStep < totalSteps - 1 && (
          <Button onClick={handleNext} size="sm" className="rounded-lg h-9 px-5">
            Weiter <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
