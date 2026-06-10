import { useState } from "react";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { addDrama, updateDrama } from "../store/dramaSlice";
import { useNavigate } from "react-router-dom";
import type { DramaStatus } from "../types/drama.types";
import type { Drama } from "../types/drama.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "react-datepicker";
import {
  DEFAULT_POSTER_URL,
  handlePosterError,
} from "../constants/drama.constants";

const genreOptions = [
  "Romance",
  "Comedy",
  "Drama",
  "Fantasy",
  "Thriller",
  "Mystery",
  "Action",
  "Crime",
  "Historical",
  "Medical",
  "Legal",
  "Youth",
  "Slice of Life",
  "Melodrama",
  "Horror",
  "Sci-Fi",
] as const;

type DramaFormProps = {
  initialDrama?: Drama;
};

function createDramaId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function DramaForm({ initialDrama }: DramaFormProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState(initialDrama?.title ?? "");
  const [genresInput, setGenresInput] = useState(
    initialDrama?.genres.join(", ") ?? "",
  );
  const [posterUrl, setPosterUrl] = useState(
    initialDrama?.posterUrl === DEFAULT_POSTER_URL
      ? ""
      : (initialDrama?.posterUrl ?? ""),
  );
  const [status, setStatus] = useState<DramaStatus>(
    initialDrama?.status ?? "plan-to-watch",
  );
  const [rating, setRating] = useState(
    initialDrama?.rating ? String(initialDrama.rating) : "",
  );
  const [review, setReview] = useState(initialDrama?.review ?? "");
  const [finishedAt, setFinishedAt] = useState(initialDrama?.finishedAt ?? "");
  const [totalEpisodes, setTotalEpisodes] = useState(
    initialDrama?.totalEpisodes ? String(initialDrama.totalEpisodes) : "",
  );

  const [currentEpisode, setCurrentEpisode] = useState(
    initialDrama?.currentEpisode ? String(initialDrama.currentEpisode) : "",
  );

  const showRatingField = status === "completed" || status === "dropped";
  const showFinishedAtField = status === "completed";
  const showReviewField = status === "completed" || status === "dropped";

  const showTotalEpisodesField =
    status === "plan-to-watch" ||
    status === "watching" ||
    status === "completed" ||
    status === "dropped";

  const showCurrentEpisodeField = status === "watching" || status === "dropped";

  const currentEpisodeLabel =
    status === "dropped" ? "Stopped At Episode" : "Current Episode";

  const selectedGenres = genresInput
    .split(",")
    .map((genre) => genre.trim())
    .filter(Boolean);

  const toggleGenre = (genre: string) => {
    const isSelected = selectedGenres.includes(genre);

    const nextGenres = isSelected
      ? selectedGenres.filter((selectedGenre) => selectedGenre !== genre)
      : [...selectedGenres, genre];

    setGenresInput(nextGenres.join(", "));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      alert("Drama title is required.");
      return;
    }

    const numericRating =
      showRatingField && rating ? Number(rating) : undefined;

    const numericTotalEpisodes = totalEpisodes
      ? Number(totalEpisodes)
      : undefined;

    const numericCurrentEpisode = currentEpisode
      ? Number(currentEpisode)
      : undefined;

    if (numericRating !== undefined && !Number.isFinite(numericRating)) {
      alert("Rating must be a valid number.");
      return;
    }

    if (
      numericTotalEpisodes !== undefined &&
      !Number.isFinite(numericTotalEpisodes)
    ) {
      alert("Total episodes must be a valid number.");
      return;
    }

    if (
      numericCurrentEpisode !== undefined &&
      !Number.isFinite(numericCurrentEpisode)
    ) {
      alert("Current episode must be a valid number.");
      return;
    }

    if (
      numericRating !== undefined &&
      (numericRating < 1 || numericRating > 5)
    ) {
      alert("Rating must be between 1 and 5.");
      return;
    }

    if (
      numericTotalEpisodes !== undefined &&
      (!Number.isInteger(numericTotalEpisodes) || numericTotalEpisodes < 1)
    ) {
      alert("Total episodes must be a whole number of at least 1.");
      return;
    }

    if (
      showCurrentEpisodeField &&
      numericCurrentEpisode !== undefined &&
      (!Number.isInteger(numericCurrentEpisode) || numericCurrentEpisode < 1)
    ) {
      alert("Current episode must be a whole number of at least 1.");
      return;
    }

    if (
      showCurrentEpisodeField &&
      numericTotalEpisodes !== undefined &&
      numericCurrentEpisode !== undefined &&
      numericCurrentEpisode > numericTotalEpisodes
    ) {
      alert("Current episode cannot be greater than total episodes.");
      return;
    }

    const genres = genresInput
      .split(",")
      .map((genre) => genre.trim())
      .filter(Boolean);

    const dramaData = {
      id: initialDrama?.id ?? createDramaId(),
      title: trimmedTitle,
      posterUrl: posterUrl.trim() || undefined,
      genres,
      status,
      totalEpisodes: showTotalEpisodesField ? numericTotalEpisodes : undefined,
      currentEpisode: showCurrentEpisodeField
        ? numericCurrentEpisode
        : undefined,
      rating: showRatingField ? numericRating : undefined,
      review: showReviewField ? review.trim() || undefined : undefined,
      finishedAt: showFinishedAtField ? finishedAt || undefined : undefined,
      createdAt: initialDrama?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (initialDrama) {
      dispatch(updateDrama(dramaData));
    } else {
      dispatch(addDrama(dramaData));
    }

    if (initialDrama) {
      navigate(`/dramas/${initialDrama.id}`);
    } else {
      navigate("/");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-full overflow-hidden rounded-3xl border border-border/50 bg-card/50 p-6 shadow-xl shadow-black/10 backdrop-blur-sm md:p-8"
    >
      <div className="grid min-w-0 gap-5">
        {/* title */}
        <div className="flex min-w-0 flex-col gap-1">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-foreground"
          >
            Drama Title
          </label>

          <Input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-11 max-w-full rounded-md border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground/60 focus-visible:border-accent/60 focus-visible:ring-accent/20"
          />
        </div>

        {/* status / episodes / date */}
        <div className="grid min-w-0 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* status */}
          <div className="flex min-w-0 flex-col gap-1">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-foreground"
            >
              Status
            </label>

            <Select
              value={status}
              onValueChange={(value) => setStatus(value as DramaStatus)}
            >
              <SelectTrigger
                id="status"
                className="w-full min-w-0 max-w-full rounded-md border-border/50 bg-background/50 px-3 py-1 text-sm text-foreground data-[size=default]:h-11 focus:border-accent/60 focus:ring-accent/20"
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                sideOffset={6}
              >
                <SelectItem
                  className="h-11 cursor-pointer"
                  value="plan-to-watch"
                >
                  Plan to Watch
                </SelectItem>

                <SelectItem className="h-11 cursor-pointer" value="watching">
                  Watching
                </SelectItem>

                <SelectItem className="h-11 cursor-pointer" value="completed">
                  Completed
                </SelectItem>

                <SelectItem className="h-11 cursor-pointer" value="dropped">
                  Dropped
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* total episodes */}
          {showTotalEpisodesField && (
            <div className="flex min-w-0 flex-col gap-1">
              <label
                htmlFor="totalEpisodes"
                className="block text-sm font-medium text-foreground"
              >
                Total Episodes
              </label>

              <Input
                id="totalEpisodes"
                type="number"
                min="1"
                step="1"
                value={totalEpisodes}
                onChange={(event) => setTotalEpisodes(event.target.value)}
                placeholder="16"
                className="h-11 max-w-full rounded-md border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground/60 focus-visible:border-accent/60 focus-visible:ring-accent/20"
              />
            </div>
          )}

          {/* current episode */}
          {showCurrentEpisodeField && (
            <div className="flex min-w-0 flex-col gap-1">
              <label
                htmlFor="currentEpisode"
                className="block text-sm font-medium text-foreground"
              >
                {currentEpisodeLabel}
              </label>

              <Input
                id="currentEpisode"
                type="number"
                min="1"
                step="1"
                value={currentEpisode}
                onChange={(event) => setCurrentEpisode(event.target.value)}
                placeholder={
                  status === "dropped"
                    ? "Episode you stopped at"
                    : "Episode you are on"
                }
                className="h-11 max-w-full rounded-md border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground/60 focus-visible:border-accent/60 focus-visible:ring-accent/20"
              />
            </div>
          )}

          {/* finishedAt */}
          {showFinishedAtField && (
            <div className="flex min-w-0 flex-col gap-1">
              <label
                htmlFor="finishedAt"
                className="block text-sm font-medium text-foreground"
              >
                Finished At
              </label>

              <DatePicker
                id="finishedAt"
                selected={
                  finishedAt ? new Date(`${finishedAt}T00:00:00`) : null
                }
                onChange={(date: Date | null) => {
                  if (!date) {
                    setFinishedAt("");
                    return;
                  }

                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const day = String(date.getDate()).padStart(2, "0");

                  setFinishedAt(`${year}-${month}-${day}`);
                }}
                dayClassName={(date) => {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const day = String(date.getDate()).padStart(2, "0");

                  const dateValue = `${year}-${month}-${day}`;

                  return dateValue === finishedAt
                    ? "kdrama-datepicker-day kdrama-datepicker-day--selected"
                    : "kdrama-datepicker-day";
                }}
                calendarClassName="kdrama-datepicker"
                dateFormat="yyyy-MM-dd"
                placeholderText="Pick a date"
                isClearable
                wrapperClassName="w-full"
                className="h-11 w-full max-w-full rounded-md border border-border/50 bg-background/50 px-3 py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
              />
            </div>
          )}
        </div>

        {/* rating */}
        {showRatingField && (
          <div className="flex min-w-0 flex-col gap-1">
            <label className="block text-sm font-medium text-foreground">
              Rating
            </label>

            <div className="flex h-11 items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const isSelected = Number(rating) >= star;

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      const currentRating = Number(rating);

                      if (currentRating === star) {
                        const newRating = star - 1;
                        setRating(newRating === 0 ? "" : String(newRating));
                      } else {
                        setRating(String(star));
                      }
                    }}
                    className="text-muted-foreground transition-colors hover:text-accent"
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    <HugeiconsIcon
                      icon={StarIcon}
                      size={26}
                      color="currentColor"
                      strokeWidth={1.8}
                      className={isSelected ? "fill-accent text-accent" : ""}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* review */}
        {showReviewField && (
          <div className="flex min-w-0 flex-col gap-1">
            <label
              htmlFor="review"
              className="block text-sm font-medium text-foreground"
            >
              {status === "dropped" ? "Reason / Notes" : "Review"}
            </label>

            <Textarea
              id="review"
              value={review}
              onChange={(event) => setReview(event.target.value)}
              placeholder={
                status === "dropped"
                  ? "Why did you drop this drama?"
                  : "Write your thoughts about this drama..."
              }
              className="no-scrollbar min-h-44 max-h-64 max-w-full resize-none overflow-y-auto rounded-md border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground/60 focus-visible:border-accent/60 focus-visible:ring-accent/20 sm:min-h-48 sm:max-h-80"
            />
          </div>
        )}

        {/* genres */}
        <div className="flex min-w-0 flex-col gap-1">
          <label className="block text-sm font-medium text-foreground">
            Genres
          </label>

          <div className="flex flex-wrap gap-2">
            {genreOptions.map((genre) => {
              const isSelected = selectedGenres.includes(genre);

              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`rounded-full px-3 py-1.5 text-sm transition-all duration-200 ${
                    isSelected
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        {/* posterUrl */}
        <div className="flex min-w-0 flex-col gap-1">
          <label
            htmlFor="posterUrl"
            className="block text-sm font-medium text-foreground"
          >
            Poster URL
          </label>

          <Input
            id="posterUrl"
            type="url"
            value={posterUrl}
            onChange={(event) => setPosterUrl(event.target.value)}
            placeholder="https://example.com/poster.jpg"
            className="h-11 max-w-full rounded-md border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground/60 focus-visible:border-accent/60 focus-visible:ring-accent/20"
          />

          <div className="pt-3">
            <p className="mb-2 text-xs text-muted-foreground">
              Poster preview
            </p>

            <div className="w-36 overflow-hidden rounded-xl border border-border/50 bg-background/50">
              <img
                src={posterUrl.trim() || DEFAULT_POSTER_URL}
                onError={handlePosterError}
                alt="Poster preview"
                className="aspect-2/3 w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              navigate(initialDrama ? `/dramas/${initialDrama.id}` : "/");
            }}
            className="h-11 rounded-md border-border/70 bg-background/30 text-foreground transition-colors hover:border-accent/60 hover:bg-accent/10 hover:text-foreground sm:min-w-28"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="h-11 rounded-md bg-accent text-accent-foreground transition-colors hover:bg-accent/90 sm:min-w-32"
          >
            {initialDrama ? "Update Drama" : "Add Drama"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default DramaForm;
