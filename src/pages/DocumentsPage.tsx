import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { mockDocuments, mockProjects, documentTypeLabels } from "@/data/mockData";
import {
  Search,
  Download,
  FileText,
  Filter,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = mockDocuments.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || d.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getProjectName = (id: string) =>
    mockProjects.find((p) => p.id === id)?.name || "—";

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl">
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium mb-2">Dokumente</p>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Dokumentenübersicht</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Alle generierten Projektdokumente
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Dokumente durchsuchen..."
            className="pl-9 rounded-lg h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48 rounded-lg h-10">
            <Filter className="mr-2 h-3.5 w-3.5" />
            <SelectValue placeholder="Dokumenttyp" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            <SelectItem value="all">Alle Typen</SelectItem>
            <SelectItem value="kickoff">Kick-off</SelectItem>
            <SelectItem value="blueprint">Blueprint</SelectItem>
            <SelectItem value="customizing">Customizing</SelectItem>
            <SelectItem value="report">Bericht</SelectItem>
            <SelectItem value="checklist">Checkliste</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-secondary/30">
              <th className="text-left p-3 font-medium text-[11px] uppercase tracking-wider text-muted-foreground">Dokument</th>
              <th className="text-left p-3 font-medium text-[11px] uppercase tracking-wider text-muted-foreground">Projekt</th>
              <th className="text-left p-3 font-medium text-[11px] uppercase tracking-wider text-muted-foreground">Typ</th>
              <th className="text-left p-3 font-medium text-[11px] uppercase tracking-wider text-muted-foreground">Version</th>
              <th className="text-left p-3 font-medium text-[11px] uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="text-left p-3 font-medium text-[11px] uppercase tracking-wider text-muted-foreground">Erstellt</th>
              <th className="text-left p-3 font-medium text-[11px] uppercase tracking-wider text-muted-foreground">Größe</th>
              <th className="text-right p-3 font-medium text-[11px] uppercase tracking-wider text-muted-foreground">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc) => (
              <tr key={doc.id} className="border-b last:border-0 hover:bg-secondary/20 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="font-medium text-sm">{doc.name}</span>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground text-xs">{getProjectName(doc.projectId)}</td>
                <td className="p-3 text-muted-foreground text-xs">{documentTypeLabels[doc.type]}</td>
                <td className="p-3 text-muted-foreground text-xs">v{doc.version}</td>
                <td className="p-3"><StatusBadge status={doc.status} /></td>
                <td className="p-3 text-muted-foreground text-xs">{doc.createdAt}</td>
                <td className="p-3 text-muted-foreground text-xs">{doc.size}</td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" disabled={doc.status !== "generated"} className="h-7 w-7">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" disabled={doc.status !== "generated"} className="h-7 w-7">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="h-10 w-10 mx-auto mb-4 opacity-20" />
            <p className="text-sm">Keine Dokumente gefunden</p>
          </div>
        )}
      </div>
    </div>
  );
}
