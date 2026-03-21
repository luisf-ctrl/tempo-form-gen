import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold">Dokumente</h1>
        <p className="text-muted-foreground mt-1">
          Alle generierten Projektdokumente
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Dokumente durchsuchen..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Dokumenttyp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Typen</SelectItem>
            <SelectItem value="kickoff">Kick-off</SelectItem>
            <SelectItem value="blueprint">Blueprint</SelectItem>
            <SelectItem value="customizing">Customizing</SelectItem>
            <SelectItem value="report">Bericht</SelectItem>
            <SelectItem value="checklist">Checkliste</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-4 font-medium text-muted-foreground">Dokument</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Projekt</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Typ</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Version</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Erstellt</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Größe</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr key={doc.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-medium">{doc.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{getProjectName(doc.projectId)}</td>
                    <td className="p-4 text-muted-foreground">{documentTypeLabels[doc.type]}</td>
                    <td className="p-4 text-muted-foreground">v{doc.version}</td>
                    <td className="p-4"><StatusBadge status={doc.status} /></td>
                    <td className="p-4 text-muted-foreground">{doc.createdAt}</td>
                    <td className="p-4 text-muted-foreground">{doc.size}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" disabled={doc.status !== "generated"}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" disabled={doc.status !== "generated"}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Keine Dokumente gefunden</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
