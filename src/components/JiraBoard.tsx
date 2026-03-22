import { useState } from "react";
import { cn } from "@/lib/utils";
import { Plus, GripVertical, MessageSquare, Paperclip, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export type TaskPriority = "critical" | "high" | "medium" | "low";
export type TaskColumn = "backlog" | "todo" | "in_progress" | "review" | "done";

export interface BoardTask {
  id: string;
  key: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  assignee?: string;
  assigneeInitials?: string;
  comments: number;
  attachments: number;
  dueDate?: string;
  labels: string[];
  column: TaskColumn;
}

const COLUMNS: { id: TaskColumn; label: string; color: string }[] = [
  { id: "backlog", label: "Backlog", color: "bg-muted-foreground/20" },
  { id: "todo", label: "To Do", color: "bg-info/20" },
  { id: "in_progress", label: "In Progress", color: "bg-warning/20" },
  { id: "review", label: "Review", color: "bg-accent" },
  { id: "done", label: "Done", color: "bg-success/20" },
];

const priorityStyles: Record<TaskPriority, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-warning/10 text-warning-foreground border-warning/20",
  medium: "bg-info/10 text-info-foreground border-info/20",
  low: "bg-muted text-muted-foreground border-border",
};

const priorityLabels: Record<TaskPriority, string> = {
  critical: "Kritisch",
  high: "Hoch",
  medium: "Mittel",
  low: "Niedrig",
};

const labelColors: Record<string, string> = {
  "Blueprint": "bg-foreground text-background",
  "Frontend": "bg-info/15 text-foreground border border-info/20",
  "Backend": "bg-success/15 text-foreground border border-success/20",
  "Migration": "bg-warning/15 text-foreground border border-warning/20",
  "Testing": "bg-destructive/10 text-foreground border border-destructive/20",
  "Customizing": "bg-accent text-foreground border border-border",
  "Dokumentation": "bg-muted text-foreground border border-border",
  "Integration": "bg-info/10 text-foreground border border-info/15",
};

interface JiraBoardProps {
  tasks: BoardTask[];
}

export function JiraBoard({ tasks }: JiraBoardProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [boardTasks, setBoardTasks] = useState<BoardTask[]>(tasks);

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDrop = (column: TaskColumn) => {
    if (!draggedTask) return;
    setBoardTasks((prev) =>
      prev.map((t) => (t.id === draggedTask ? { ...t, column } : t))
    );
    setDraggedTask(null);
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {COLUMNS.map((col) => {
        const colTasks = boardTasks.filter((t) => t.column === col.id);
        return (
          <div
            key={col.id}
            className="min-w-[240px] flex-1 flex flex-col"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full", col.color)} />
                <span className="text-xs font-medium uppercase tracking-wider">{col.label}</span>
                <span className="text-[10px] text-muted-foreground font-medium bg-secondary rounded-full h-5 w-5 flex items-center justify-center">
                  {colTasks.length}
                </span>
              </div>
            </div>

            {/* Task Cards */}
            <div className="space-y-2 flex-1">
              {colTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  className={cn(
                    "p-3 rounded-lg border border-border/60 bg-card hover:border-border transition-all cursor-grab active:cursor-grabbing group",
                    draggedTask === task.id && "opacity-40"
                  )}
                >
                  {/* Labels */}
                  {task.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {task.labels.map((label) => (
                        <span
                          key={label}
                          className={cn(
                            "text-[9px] font-medium px-1.5 py-0.5 rounded",
                            labelColors[label] || "bg-secondary text-foreground"
                          )}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <p className="text-sm font-medium leading-snug mb-1.5">{task.title}</p>

                  {/* Key & Priority */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono text-muted-foreground">{task.key}</span>
                    <span
                      className={cn(
                        "text-[9px] font-medium px-1.5 py-0.5 rounded border",
                        priorityStyles[task.priority]
                      )}
                    >
                      {priorityLabels[task.priority]}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      {task.comments > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px]">
                          <MessageSquare className="h-3 w-3" /> {task.comments}
                        </span>
                      )}
                      {task.attachments > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px]">
                          <Paperclip className="h-3 w-3" /> {task.attachments}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="flex items-center gap-0.5 text-[10px]">
                          <Clock className="h-3 w-3" /> {task.dueDate}
                        </span>
                      )}
                    </div>
                    {task.assigneeInitials && (
                      <div className="h-5 w-5 rounded-full bg-foreground flex items-center justify-center">
                        <span className="text-[8px] font-medium text-background">
                          {task.assigneeInitials}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
