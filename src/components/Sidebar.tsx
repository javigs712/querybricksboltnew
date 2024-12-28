import { Users, DollarSign, FolderKanban, MessageSquare, Building } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Users, label: "Usuarios", href: "#" },
  { icon: DollarSign, label: "Inversores", href: "#" },
  { icon: FolderKanban, label: "Proyectos", href: "#" },
  { icon: MessageSquare, label: "Chat IA", href: "#", active: true },
];

export function Sidebar() {
  return (
    <nav className="w-64 bg-domoblock-panel min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <Building className="h-8 w-8 text-domoblock-accent" />
      </div>
      <div className="space-y-2">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
              item.active
                ? "bg-domoblock-accent text-white"
                : "text-gray-400 hover:bg-gray-800"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}