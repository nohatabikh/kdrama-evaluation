import { useAppSelector } from "../../../hooks/useAppSelector";
import DramaList from "../components/DramaList";
import { useState } from "react";
import type { StatusFilter } from "../types/drama.types";
import DramaFilters from "../components/DramaFilters";
import { HugeiconsIcon } from "@hugeicons/react";
import { Film01Icon } from "@hugeicons/core-free-icons";

function DramaListPage() {
  const dramas = useAppSelector((state) => state.dramas.items);

  const [searchTerm, setSearchTerm] = useState("");
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredDramas = dramas.filter((drama) => {
    const matchesSearch = drama.title
      .toLowerCase()
      .includes(normalizedSearchTerm);

    const matchesStatus =
      statusFilter === "all" || drama.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalDramas = dramas.length;

  const watchingCount = dramas.filter(
    (drama) => drama.status === "watching",
  ).length;

  const completedCount = dramas.filter(
    (drama) => drama.status === "completed",
  ).length;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8">
      <div className="pointer-events-none absolute -left-30 top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-35 top-80 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="mb-8 text-center">
          <h2 className="mb-4 text-balance font-serif text-4xl font-bold text-foreground md:text-5xl">
            Your Drama Journey
          </h2>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Track, rate, and remember every emotional moment from your favorite
            Korean dramas.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-6">
          <div className="rounded-2xl border border-border/50 bg-card/40 p-4 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {totalDramas}
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/40 p-4 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">Watching</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {watchingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/40 p-4 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {completedCount}
            </p>
          </div>
        </section>
        <DramaFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchTermChange={setSearchTerm}
          onStatusChange={setStatusFilter}
        />

        {dramas.length === 0 ? (
          <div className="rounded-3xl border border-border/50 bg-card/40 p-10 text-center backdrop-blur-sm">
            <HugeiconsIcon
              icon={Film01Icon}
              size={28}
              color="currentColor"
              strokeWidth={1.5}
            />

            <p className="text-lg font-medium text-foreground">
              No dramas added yet
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Add your first drama to start building your journal.
            </p>
          </div>
        ) : filteredDramas.length === 0 ? (
          <div className="rounded-3xl border border-border/50  bg-card/70 p-10 text-center shadow-lg shadow-black/20 backdrop-blur-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
              <HugeiconsIcon
                icon={Film01Icon}
                size={28}
                color="currentColor"
                strokeWidth={1.5}
              />
            </div>

            <p className="text-lg font-medium text-foreground">
              No dramas found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <DramaList dramas={filteredDramas} />
        )}
      </div>
    </main>
  );
}

export default DramaListPage;
