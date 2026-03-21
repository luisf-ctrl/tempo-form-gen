import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border/60 bg-background px-6 shrink-0">
            <SidebarTrigger className="mr-4 hover:bg-secondary rounded-lg" />
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center">
                <span className="text-xs font-medium text-background">MB</span>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-8 lg:p-10">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
