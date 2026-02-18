import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Scissors, ClipboardList, Plus, BarChart3 } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout = ({ children, activeTab, onTabChange }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card shadow-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Scissors className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Sastrería Premium</h1>
                <p className="text-sm text-muted-foreground">Confección de Chacabanas Personalizadas</p>
              </div>
            </div>
            
            <nav className="flex space-x-2">
              <Button
                variant={activeTab === "orders" ? "default" : "outline"}
                onClick={() => onTabChange("orders")}
                className="flex items-center space-x-2"
              >
                <ClipboardList className="h-4 w-4" />
                <span>Órdenes</span>
              </Button>
              <Button
                variant={activeTab === "new-order" ? "default" : "outline"}
                onClick={() => onTabChange("new-order")}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Nueva Orden</span>
              </Button>
              <Button
                variant={activeTab === "reports" ? "default" : "outline"}
                onClick={() => onTabChange("reports")}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Reportes</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;