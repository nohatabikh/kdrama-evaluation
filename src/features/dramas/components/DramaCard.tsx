import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tick01Icon,
  Clock01Icon,
  ViewIcon,
  PauseIcon,
  PlayIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { Drama } from "../types/drama.types";

type DramaCardProps = {
  drama: Drama;
};

const statusIcons = {
  watching: PlayIcon,
  completed: Tick01Icon,
  "plan-to-watch": Clock01Icon,
  dropped: Cancel01Icon,
  "on-hold": PauseIcon,
} as const;

function formatStatus(status: string) {
  return status
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function DramaCard({ drama }: DramaCardProps) {
  const statusKey = drama.status.toLowerCase() as keyof typeof statusIcons;
  const StatusIcon = statusIcons[statusKey] ?? Clock01Icon;

  return (
    <Link to={`/dramas/${drama.id}`} className="group block">
      <Card className="cursor-pointer overflow-hidden border border-border/50 bg-card/50 ring-0 backdrop-blur-sm transition-all duration-300 hover:border-accent/50 hover:bg-card/70 hover:shadow-xl hover:shadow-accent/10">
        {drama.posterUrl && (
          <div className="relative aspect-2/3 overflow-hidden">
            <img
              src={drama.posterUrl}
              alt={`${drama.title} poster`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent opacity-60" />

            <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
              <Badge
                variant="outline"
                className="inline-flex items-center gap-1 border-accent/40 bg-background/70 text-xs font-medium text-accent backdrop-blur-md"
              >
                <HugeiconsIcon
                  icon={StatusIcon}
                  size={12}
                  color="currentColor"
                  strokeWidth={2}
                  className="shrink-0"
                />
                <span className="leading-none">
                  {formatStatus(drama.status)}
                </span>
              </Badge>
            </div>

            {drama.rating && (
              <div className="absolute right-2 top-2 rounded-lg bg-background/80 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-md sm:right-3 sm:top-3">
                ★ {drama.rating}/5
              </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center bg-background/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="p-4 text-center">
                <HugeiconsIcon
                  icon={ViewIcon}
                  size={32}
                  color="currentColor"
                  strokeWidth={1.5}
                  className="mx-auto mb-2 text-accent"
                />
                <p className="text-sm font-medium text-foreground sm:text-base">
                  View Details
                </p>
              </div>
            </div>
          </div>
        )}
        <CardContent className="p-3 sm:p-4">
          <h3 className="line-clamp-1 font-serif text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
            {drama.title}
          </h3>

          {drama.genres.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {drama.genres.slice(0, 2).map((genre) => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="border-0 bg-secondary/50 text-xs text-secondary-foreground/80"
                >
                  {genre}
                </Badge>
              ))}
            </div>
          )}
          {drama.totalEpisodes && (
            <p className="mt-3 text-xs text-muted-foreground">
              {drama.status === "watching" && drama.currentEpisode
                ? `Episode ${drama.currentEpisode} of ${drama.totalEpisodes}`
                : drama.status === "dropped" && drama.currentEpisode
                  ? `Stopped at episode ${drama.currentEpisode} of ${drama.totalEpisodes}`
                  : `${drama.totalEpisodes} episodes`}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default DramaCard;
