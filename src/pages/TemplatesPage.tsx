import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold">Templates & Blueprints</h1>
        <p className="text-muted-foreground mt-1">
          Verfügbare Dokumentvorlagen und Blueprint-Varianten
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Templates durchsuchen..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-primary/5 flex items-center justify-center">
                    <BookTemplate className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-sm">{template.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {documentTypeLabels[template.type]}
                    </p>
                  </div>
                </div>
                <StatusBadge status={template.status} />
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {template.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
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

              <Button variant="outline" size="sm" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                Details anzeigen
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <BookTemplate className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Keine Templates gefunden</p>
        </div>
      )}
    </div>
  );
}
