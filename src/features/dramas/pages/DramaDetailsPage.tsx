import { useAppSelector } from "../../../hooks/useAppSelector";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteDrama } from "../store/dramaSlice";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { Home, MoreHorizontal, Pencil, Quote, Star, Trash2 } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import RecoveryPanel from "../../../components/layout/RecoveryPanel";
import {
  DEFAULT_POSTER_URL,
  DRAMA_STATUS_LABELS,
  handlePosterError,
} from "../constants/drama.constants";

function DramaDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { drama, isHydrated } = useAppSelector((state) => ({
    drama: state.dramas.items.find((drama) => drama.id === id),
    isHydrated:
      state.dramas.hydrationStatus === "loaded" &&
      state.dramas.userId === state.auth.user?.id,
  }));

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5 py-10 text-foreground">
        <div className="text-center" role="status">
          <div
            className="mx-auto mb-4 size-8 animate-spin rounded-full border-2 border-border border-t-accent"
            aria-hidden="true"
          />
          <p className="text-sm text-muted-foreground">
            Loading drama details...
          </p>
        </div>
      </div>
    );
  }

  if (!drama) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 text-foreground">
        <div className="pointer-events-none absolute -left-30 top-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-35 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />

        <RecoveryPanel
          eyebrow="Not Found"
          title="This drama is not in your diary."
          description="It may have been deleted, belong to another account, or the link may be old."
          actionLabel="Back to collection"
          actionTo="/"
          ActionIcon={Home}
        />
      </div>
    );
  }

  const handleDeleteDrama = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${drama.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    dispatch(deleteDrama(drama.id));
    navigate("/");
  };

  const ratingStars = Math.min(5, Math.max(0, Math.round(drama.rating ?? 0)));

  const showsRating =
    drama.status === "completed" || drama.status === "dropped";

  const showsReview =
    drama.status === "completed" || drama.status === "dropped";

  const showsFinishedDate = drama.status === "completed";

  return (
    <div className="relative min-h-screen overflow-hidden px-5 pb-8 pt-16 text-foreground">
      <div className="pointer-events-none absolute -left-30 top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-35 top-72 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-accent hover:text-foreground"
          >
            &larr; Back to collection
          </Link>
        </div>

        <section className="relative overflow-hidden rounded-4xl border border-border bg-card shadow-2xl">
          <div className="absolute right-4 top-4 z-30 flex items-center gap-1">
            <Link
              to={`/dramas/${drama.id}/edit`}
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-background/55 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
              aria-label="Edit drama"
            >
              <Pencil className="size-4" aria-hidden="true" />
              Edit
            </Link>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background/55 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 data-[state=open]:bg-background/55 data-[state=open]:text-accent"
                  aria-label="More drama actions"
                >
                  <MoreHorizontal className="size-5" aria-hidden="true" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={8}
                  className="z-60 min-w-44 rounded-xl border border-border/80 bg-popover/95 p-1.5 text-popover-foreground shadow-xl shadow-black/30 backdrop-blur-xl data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                >
                  <DropdownMenu.Item
                    onSelect={handleDeleteDrama}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground outline-none transition-colors focus:bg-destructive/10 focus:text-destructive"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    Delete drama
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>

          <img
            src={drama.posterUrl || DEFAULT_POSTER_URL}
            onError={handlePosterError}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-44 hidden h-full w-full scale-110 object-cover opacity-20 blur-3xl md:block"
          />

          <div className="absolute inset-0 bg-linear-to-r from-card via-card/95 to-card/90" />

          <div className="relative grid md:grid-cols-[420px_1fr]">
            <div className="relative overflow-hidden bg-background shadow-2xl">
              <img
                src={drama.posterUrl || DEFAULT_POSTER_URL}
                onError={handlePosterError}
                alt={`${drama.title} poster`}
                className="h-full min-h-115 w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-linear-to-r from-transparent to-card md:block" />
            </div>

            <div className="flex min-w-0 flex-col justify-start p-6 pt-16 md:p-8 md:pt-16">
              <p className="mb-3 text-sm uppercase tracking-[0.35em] text-muted-foreground">
                Drama Details
              </p>

              <h1 className="mb-6 min-w-0 max-w-full wrap-anywhere font-serif text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                {drama.title}
              </h1>

              {drama.genres.length > 0 && (
                <div className="mb-8 flex flex-wrap gap-2">
                  {drama.genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-border bg-secondary px-4 py-1 text-sm text-secondary-foreground"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid gap-4 rounded-2xl border border-border/70 bg-background/40 p-4 shadow-xl backdrop-blur-md sm:grid-cols-3 sm:divide-x sm:divide-border/70">
                <div className="sm:pr-4">
                  <p className="mb-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Status
                  </p>
                  <p className="text-lg font-medium text-accent">
                    {DRAMA_STATUS_LABELS[drama.status]}
                  </p>
                </div>

                <div className="sm:px-4">
                  <p className="mb-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Rating
                  </p>
                  {showsRating && drama.rating ? (
                    <div
                      className="mt-1.5 flex items-center gap-1 text-accent"
                      aria-label={`${ratingStars} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          className={`h-5 w-5 ${
                            index < ratingStars
                              ? "fill-accent text-accent"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-lg font-medium">Not rated</p>
                  )}
                </div>

                <div className="sm:pl-4">
                  <p className="mb-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Finished
                  </p>
                  <p className="text-lg font-medium text-accent">
                    {showsFinishedDate && drama.finishedAt
                      ? drama.finishedAt
                      : "Not finished"}
                  </p>
                </div>
              </div>

              {showsReview && drama.review && (
                <div className="mt-8 grid gap-5">
                  <div className="rounded-xl border border-border/70 bg-background/40 p-5 shadow-xl backdrop-blur-md">
                    <div className="flex items-start gap-3">
                      <Quote className="mt-0.5 h-5 w-5 shrink-0 fill-accent text-accent" />
                      <div className="min-w-0">
                        <h3 className="mb-2 mt-0.5 text-sm text-accent/80">
                          Your Review
                        </h3>
                        <p className="no-scrollbar max-h-64 overflow-y-auto break-all leading-relaxed text-foreground/90 italic md:max-h-72">
                          {drama.review}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DramaDetailsPage;
