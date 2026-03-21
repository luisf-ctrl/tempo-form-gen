import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import {
  mockProjects,
  mockDocuments,
  mockActivities,
  mockUpdates,
  mockProjectLinks,
  mockBlogPosts,
  blogCategoryLabels,
  documentTypeLabels,
} from "@/data/mockData";
import {
  FolderOpen,
  FileText,
  FilePlus,
  TrendingUp,
  Clock,
  Download,
  Plus,
  ArrowRight,
  Newspaper,
  Link2,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Aktive Projekte", value: mockProjects.filter((p) => p.status === "active").length, icon: FolderOpen, color: "text-primary" },
  { label: "Generierte Dokumente", value: mockDocuments.filter((d) => d.status === "generated").length, icon: FileText, color: "text-info" },
  { label: "In Bearbeitung", value: mockDocuments.filter((d) => d.status === "pending").length, icon: Clock, color: "text-warning" },
  { label: "Erfolgsrate", value: "94%", icon: TrendingUp, color: "text-primary" },
];

const activityIcons = {
  create: Plus,
  generate: FilePlus,
  update: TrendingUp,
  download: Download,
};

const categoryColors: Record<string, string> = {
  documentation: "bg-blue-100 text-blue-700",
  architecture: "bg-purple-100 text-purple-700",
  lessons: "bg-amber-100 text-amber-700",
  update: "bg-green-100 text-green-700",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Willkommen zurück, Max Berger</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/projects">
              <Plus className="mr-2 h-4 w-4" />
              Neues Projekt
            </Link>
          </Button>
          <Button asChild>
            <Link to="/generate">
              <FilePlus className="mr-2 h-4 w-4" />
              Dokument generieren
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-heading font-bold mt-1">{stat.value}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-heading">Aktuelle Projekte</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/projects">
                Alle anzeigen <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockProjects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{project.name}</p>
                    <StatusBadge status={project.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{project.client}</p>
                </div>
                <div className="w-32 hidden sm:block">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Fortschritt</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {project.documentsGenerated} Dok.
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-heading">Letzte Aktivitäten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockActivities.map((activity) => {
              const Icon = activityIcons[activity.type];
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.project}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Updates & Ressourcen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Letzte Updates */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Newspaper className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-heading">Letzte Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-muted-foreground">Datum</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Thema</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Autor</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUpdates.map((update) => (
                    <tr key={update.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2.5 text-muted-foreground whitespace-nowrap">{update.date}</td>
                      <td className="py-2.5 font-medium">{update.topic}</td>
                      <td className="py-2.5 text-muted-foreground whitespace-nowrap">{update.author}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Wichtige Links & Tools */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Link2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-heading">Wichtige Links & Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-muted-foreground">Tool</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {mockProjectLinks.map((link) => (
                    <tr key={link.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2.5 font-medium">{link.tool}</td>
                      <td className="py-2.5">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          Öffnen
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blog / Wissensbereich */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-heading">Wissensbereich</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockBlogPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-xl border hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[post.category] || "bg-muted text-muted-foreground"}`}>
                    {blogCategoryLabels[post.category]}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
                <h4 className="font-medium text-sm mb-1">{post.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <p className="text-xs text-muted-foreground mt-2">von {post.author}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Documents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-heading">Zuletzt generierte Dokumente</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/documents">
              Alle anzeigen <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-muted-foreground">Dokument</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Typ</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Version</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Datum</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {mockDocuments.slice(0, 4).map((doc) => (
                  <tr key={doc.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-3 font-medium">{doc.name}</td>
                    <td className="py-3 text-muted-foreground">{documentTypeLabels[doc.type]}</td>
                    <td className="py-3 text-muted-foreground">v{doc.version}</td>
                    <td className="py-3"><StatusBadge status={doc.status} /></td>
                    <td className="py-3 text-muted-foreground">{doc.createdAt}</td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm" disabled={doc.status !== "generated"}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
