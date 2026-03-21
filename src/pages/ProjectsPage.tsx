import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  // New project form
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Projekte</h1>
          <p className="text-muted-foreground mt-1">
            {projects.length} Projekte insgesamt
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Neues Projekt
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading">Neues Projekt anlegen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Projektname *</Label>
                <Input
                  placeholder="z. B. SAP Migration Phase 2"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Kundenname *</Label>
                <Input
                  placeholder="Name des Kunden"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Lösungsbereich *</Label>
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
                          "flex items-center gap-2 p-3 rounded-xl border text-left transition-all text-sm",
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:bg-muted/50"
                        )}
                      >
                        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", area.color)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{area.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Beschreibung</Label>
                <Textarea
                  placeholder="Kurze Projektbeschreibung..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
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
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
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
            <Card
              key={project.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-primary/5 flex items-center justify-center">
                      <FolderOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-heading">
                        {project.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">{project.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={project.status} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => handleDelete(e, project.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {areaConfig && (
                  <Badge variant="outline" className={cn("text-xs", areaConfig.color)}>
                    {areaConfig.label}
                  </Badge>
                )}
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                )}
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Fortschritt</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{project.updatedAt}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {project.generatedDocuments.length} Dokumente
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>{projects.length === 0 ? "Noch keine Projekte vorhanden" : "Keine Projekte gefunden"}</p>
          {projects.length === 0 && (
            <Button variant="outline" className="mt-4" onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Erstes Projekt anlegen
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
