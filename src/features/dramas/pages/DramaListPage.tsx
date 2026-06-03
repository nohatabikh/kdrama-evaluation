import { useAppSelector } from "../../../hooks/useAppSelector";
import DramaList from "../components/DramaList";
import { useState } from "react";
import type { StatusFilter } from "../types/drama.types";
import DramaFilters from "../components/DramaFilters";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Clock01Icon,
  Film01Icon,
  PlayIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";

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

  const planToWatchCount = dramas.filter(
    (drama) => drama.status === "plan-to-watch",
  ).length;

  const droppedCount = dramas.filter(
    (drama) => drama.status === "dropped",
  ).length;

  const summaryCards = [
    { label: "Total", value: totalDramas, icon: Film01Icon },
    { label: "Watching", value: watchingCount, icon: PlayIcon },
    { label: "Completed", value: completedCount, icon: Tick01Icon },
    { label: "Plan to Watch", value: planToWatchCount, icon: Clock01Icon },
    { label: "Dropped", value: droppedCount, icon: Cancel01Icon },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8">
      <div className="pointer-events-none absolute -left-30 top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-35 top-80 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="mb-12 py-8 text-center md:py-12">
          <h2 className="mb-4 text-balance font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-[2.75rem]">
            A Diary for Every Drama
          </h2>

          <p className="mx-auto max-w-4xl text-base leading-relaxed text-muted-foreground md:whitespace-nowrap md:text-lg">
            Collect the shows you have watched, the ones waiting for you, and
            the stories you do not want to forget.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-border/50 bg-card/50 px-4 py-6 text-center shadow-lg shadow-black/10 backdrop-blur-xl transition-colors duration-200 hover:border-accent/50"
            >
              <div className="mb-2 text-accent drop-shadow-[0_0_5px_rgba(193,160,172,0.22)]">
                <HugeiconsIcon
                  icon={card.icon}
                  size={26}
                  color="currentColor"
                  strokeWidth={1.8}
                />
              </div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="mt-3 text-2xl font-semibold text-foreground">
                {card.value}
              </p>
            </div>
          ))}
        </section>
        <DramaFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchTermChange={setSearchTerm}
          onStatusChange={setStatusFilter}
        />

        {dramas.length === 0 ? (
          <div className="rounded-3xl border border-border/50 bg-card/40 p-10 text-center backdrop-blur-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
              <HugeiconsIcon
                icon={Film01Icon}
                size={28}
                color="currentColor"
                strokeWidth={1.5}
              />
            </div>

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
