import { Train } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] hidden md:block">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Train className="h-4 w-4 text-brand-500" />
            <span className="text-sm font-semibold">
              GateWatch Vaniyambadi
            </span>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            &copy; {new Date().getFullYear()} Built for Vaniyambadi
          </p>
        </div>
      </div>
    </footer>
  );
}
