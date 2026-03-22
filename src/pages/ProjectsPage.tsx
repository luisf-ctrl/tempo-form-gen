import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Plus,
  Search,
  Filter,
  FolderOpen,
  Calendar,
  Trash2,
  ArrowUpRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Project, SolutionArea } from "@/types";
import { getProjects, createProject, deleteProject } from "@/lib/projectStore";
import { solutionAreas, solutionAreaLabels } from "@/data/solutionAreas";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [newName, setNewName] = useState("");
  const [newClient, setNewClient] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newArea, setNewArea] = useState<SolutionArea | "">("");

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    if (!newName || !newClient || !newArea) return;
    const project = createProject(newName, newClient, newDescription, newArea as SolutionArea);
    setProjects(getProjects());
    setDialogOpen(false);
    setNewName("");
    setNewClient("");
    setNewDescription("");
    setNewArea("");
    navigate(`/projects/${project.id}`);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteProject(id);
    setProjects(getProjects());
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium mb-2">Projekte</p>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Projektübersicht</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {projects.length} Projekte insgesamt
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-lg text-xs h-9">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Neues Projekt
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-heading text-lg">Neues Projekt anlegen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Projektname *</Label>
                <Input
                  placeholder="z. B. SAP Migration Phase 2"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="rounded-lg h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Kundenname *</Label>
                <Input
                  placeholder="Name des Kunden"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  className="rounded-lg h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Lösungsbereich *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {solutionAreas.map((area) => {
                    const Icon = area.icon;
                    const isSelected = newArea === area.id;
                    return (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => setNewArea(area.id)}
                        className={cn(
                          "flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all text-sm",
                          isSelected
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground/20"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="font-medium text-xs">{area.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Beschreibung</Label>
                <Textarea
                  placeholder="Kurze Projektbeschreibung..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="rounded-lg"
                />
              </div>
              <Button
                className="w-full rounded-lg h-10"
                onClick={handleCreate}
                disabled={!newName || !newClient || !newArea}
              >
                Projekt erstellen
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Projekte durchsuchen..."
            className="pl-9 rounded-lg h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44 rounded-lg h-10">
            <Filter className="mr-2 h-3.5 w-3.5" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="active">Aktiv</SelectItem>
            <SelectItem value="draft">Entwurf</SelectItem>
            <SelectItem value="completed">Abgeschlossen</SelectItem>
            <SelectItem value="archived">Archiviert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((project) => {
          const areaConfig = solutionAreas.find((a) => a.id === project.solutionArea);
          return (
            <div
              key={project.id}
              className="group p-5 rounded-xl border border-border/60 bg-card hover:border-foreground/15 transition-all cursor-pointer"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-sm tracking-tight truncate">{project.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{project.client}</p>
                </div>
                <div className="flex items-center gap-1.5 ml-2">
                  <StatusBadge status={project.status} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDelete(e, project.id)}
                  >
                    <Trash2 className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </div>
              </div>

              {areaConfig && (
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2.5">
                  {areaConfig.label}
                </p>
              )}

              {project.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                  {project.description}
                </p>
              )}

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Fortschritt</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {project.updatedAt}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {project.generatedDocuments.length} Dokumente
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <FolderOpen className="h-10 w-10 mx-auto mb-4 opacity-20" />
          <p className="text-sm">{projects.length === 0 ? "Noch keine Projekte vorhanden" : "Keine Projekte gefunden"}</p>
          {projects.length === 0 && (
            <Button variant="outline" size="sm" className="mt-4 rounded-lg" onClick={() => setDialogOpen(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Erstes Projekt anlegen
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
