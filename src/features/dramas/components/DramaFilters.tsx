import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { StatusFilter } from "../types/drama.types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

type DramaFiltersProps = {
  searchTerm: string;
  statusFilter: StatusFilter;
  onSearchTermChange: (newTerm: string) => void;
  onStatusChange: (newFilter: StatusFilter) => void;
};

const statusFilterOptions = [
  { label: "All", value: "all" },
  { label: "Watching", value: "watching" },
  { label: "Completed", value: "completed" },
  { label: "Plan to Watch", value: "plan-to-watch" },
  { label: "Dropped", value: "dropped" },
] as const;

function DramaFilters({
  searchTerm,
  statusFilter,
  // Parent owns state.
  // Child displays controls.
  // Parent sends child update functions.
  // Child calls them when user interacts.
  onSearchTermChange,
  onStatusChange,
}: DramaFiltersProps) {
  return (
    <section className="space-y-4">
      <div className="relative">
        <HugeiconsIcon
          icon={Search01Icon}
          size={18}
          color="currentColor"
          strokeWidth={2}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
        />

        <Input
          type="text"
          placeholder="Search your dramas..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-11 pr-10 h-12 bg-card/50 border-border/50 focus:border-accent/50 focus:ring-accent/20 placeholder:text-muted-foreground/60"
        />
      </div>
      <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
        {statusFilterOptions.map((option) => {
          const isActive = statusFilter === option.value;

          return (
            <Button
              key={option.value}
              type="button"
              onClick={() => onStatusChange(option.value)}
              className={`min-h-9 rounded-md border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "border-accent bg-accent text-accent-foreground shadow-sm shadow-accent/20"
                  : "border-border/50 bg-card/40 text-muted-foreground hover:border-accent/50 hover:text-foreground"
              }`}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </section>
  );
}

export default DramaFilters;
