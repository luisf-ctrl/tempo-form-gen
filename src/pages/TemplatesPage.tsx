import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { mockTemplates, documentTypeLabels } from "@/data/mockData";
import {
  Search,
  BookTemplate,
  Eye,
  Calendar,
  Globe,
  Hash,
} from "lucide-react";

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockTemplates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium mb-2">Templates</p>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Templates & Blueprints</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Verfügbare Dokumentvorlagen und Blueprint-Varianten
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Templates durchsuchen..."
          className="pl-9 rounded-lg h-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((template) => (
          <div key={template.id} className="p-5 rounded-xl border border-border/60 hover:border-foreground/15 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-heading font-semibold text-sm tracking-tight">{template.name}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                  {documentTypeLabels[template.type]}
                </p>
              </div>
              <StatusBadge status={template.status} />
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
              {template.description}
            </p>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5">
                <Hash className="h-3 w-3" />
                <span>Version {template.version}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="h-3 w-3" />
                <span>{template.language}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                <span>{template.lastUpdated}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookTemplate className="h-3 w-3" />
                <span>{template.fields} Felder</span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full rounded-lg h-8 text-xs">
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              Details anzeigen
            </Button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <BookTemplate className="h-10 w-10 mx-auto mb-4 opacity-20" />
          <p className="text-sm">Keine Templates gefunden</p>
        </div>
      )}
    </div>
  );
}
