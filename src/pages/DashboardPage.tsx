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
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Aktive Projekte", value: mockProjects.filter((p) => p.status === "active").length, icon: FolderOpen },
  { label: "Generierte Dokumente", value: mockDocuments.filter((d) => d.status === "generated").length, icon: FileText },
  { label: "In Bearbeitung", value: mockDocuments.filter((d) => d.status === "pending").length, icon: Clock },
  { label: "Erfolgsrate", value: "94%", icon: TrendingUp },
];

const activityIcons = {
  create: Plus,
  generate: FilePlus,
  update: TrendingUp,
  download: Download,
};

export default function DashboardPage() {
  return (
    <div className="space-y-10 animate-fade-in max-w-6xl">
      {/* Hero */}
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium mb-3">Dashboard</p>
        <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
          Willkommen zurück
        </h1>
        <p className="text-muted-foreground mt-2 text-base">Ihre Projektübersicht auf einen Blick.</p>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" size="sm" asChild className="rounded-lg text-xs h-9">
            <Link to="/projects">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Neues Projekt
            </Link>
          </Button>
          <Button size="sm" asChild className="rounded-lg text-xs h-9">
            <Link to="/generate">
              <FilePlus className="mr-1.5 h-3.5 w-3.5" />
              Dokument generieren
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 rounded-xl border border-border/60 bg-card">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-heading font-bold tracking-tight">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-base tracking-tight">Aktuelle Projekte</h2>
            <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground hover:text-foreground h-8">
              <Link to="/projects">
                Alle <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <div className="space-y-2">
            {mockProjects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card hover:border-border transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <p className="font-medium text-sm">{project.name}</p>
                    <StatusBadge status={project.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{project.client}</p>
                </div>
                <div className="w-28 hidden sm:block">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Fortschritt</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1" />
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap font-medium">
                  {project.documentsGenerated} Dok.
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="font-heading font-semibold text-base tracking-tight mb-4">Letzte Aktivitäten</h2>
          <div className="space-y-1">
            {mockActivities.map((activity) => {
              const Icon = activityIcons[activity.type];
              return (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="h-7 w-7 rounded-md bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="h-3.5 w-3.5 text-foreground/60" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-tight">{activity.action}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{activity.project} · {activity.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Updates & Ressourcen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Letzte Updates */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-heading font-semibold text-base tracking-tight">Letzte Updates</h2>
          </div>
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary/30">
                  <th className="text-left p-3 font-medium text-[11px] uppercase tracking-wider text-muted-foreground">Datum</th>
                  <th className="text-left p-3 font-medium text-[11px] uppercase tracking-wider text-muted-foreground">Thema</th>
                  <th className="text-left p-3 font-medium text-[11px] uppercase tracking-wider text-muted-foreground">Autor</th>
                </tr>
              </thead>
              <tbody>
                {mockUpdates.map((update) => (
                  <tr key={update.id} className="border-b last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="p-3 text-muted-foreground text-xs whitespace-nowrap">{update.date}</td>
                    <td className="p-3 text-sm font-medium">{update.topic}</td>
                    <td className="p-3 text-muted-foreground text-xs whitespace-nowrap">{update.author}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Wichtige Links & Tools */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-heading font-semibold text-base tracking-tight">Wichtige Links & Tools</h2>
          </div>
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary/30">
                  <th className="text-left p-3 font-medium text-[11px] uppercase tracking-wider text-muted-foreground">Tool</th>
                  <th className="text-left p-3 font-medium text-[11px] uppercase tracking-wider text-muted-foreground">Link</th>
                </tr>
              </thead>
              <tbody>
                {mockProjectLinks.map((link) => (
                  <tr key={link.id} className="border-b last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="p-3 font-medium text-sm">{link.tool}</td>
                    <td className="p-3">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Öffnen
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Blog / Wissensbereich */}
      <div>
        <h2 className="font-heading font-semibold text-base tracking-tight mb-4">Wissensbereich</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mockBlogPosts.map((post) => (
            <div
              key={post.id}
              className="p-5 rounded-xl border border-border/60 hover:border-border transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {blogCategoryLabels[post.category]}
                </span>
                <span className="text-[10px] text-muted-foreground/60">·</span>
                <span className="text-[10px] text-muted-foreground">{post.date}</span>
              </div>
              <h4 className="font-heading font-medium text-sm mb-1.5 group-hover:text-foreground/80 transition-colors">{post.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{post.excerpt}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-3">von {post.author}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-base tracking-tight">Zuletzt generierte Dokumente</h2>
          <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground hover:text-foreground h-8">
            <Link to="/documents">
              Alle <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/30">
                <th className="text-left p-3 font-medium text-[11px] uppercase tracking-wider text-muted-foreground">Dokument</th>
                <th className="text-left p-3 font-medium text-[11px] uppercase tracking-wider text-muted-foreground">Typ</th>
                <th className="text-left p-3 font-medium text-[11px] uppercase tracking-wider text-muted-foreground">Version</th>
                <th className="text-left p-3 font-medium text-[11px] uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-[11px] uppercase tracking-wider text-muted-foreground">Datum</th>
                <th className="text-right p-3 font-medium text-[11px] uppercase tracking-wider text-muted-foreground">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {mockDocuments.slice(0, 4).map((doc) => (
                <tr key={doc.id} className="border-b last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="p-3 font-medium text-sm">{doc.name}</td>
                  <td className="p-3 text-muted-foreground text-xs">{documentTypeLabels[doc.type]}</td>
                  <td className="p-3 text-muted-foreground text-xs">v{doc.version}</td>
                  <td className="p-3"><StatusBadge status={doc.status} /></td>
                  <td className="p-3 text-muted-foreground text-xs">{doc.createdAt}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm" disabled={doc.status !== "generated"} className="h-7 w-7 p-0">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
