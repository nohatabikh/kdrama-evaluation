import { useAppSelector } from "../../../hooks/useAppSelector";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteDrama } from "../store/dramaSlice";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { Quote, Star } from "lucide-react";

function DramaDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const drama = useAppSelector((state) =>
    state.dramas.items.find((drama) => drama.id === id),
  );

  if (!drama) {
    return (
      <main className="min-h-screen bg-background px-5 py-10 text-foreground">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-card p-8 text-center shadow-2xl">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Not Found
          </p>

          <h1 className="mb-4 text-3xl font-semibold">Drama not found</h1>

          <Link
            to="/"
            className="inline-flex rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:bg-accent/10"
          >
            Back to collection
          </Link>
        </div>
      </main>
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

  const ratingStars = drama.rating ? Math.round(drama.rating / 2) : 0;

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-accent hover:text-foreground"
          >
            ← Back to collection
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to={`/dramas/${drama.id}/edit`}
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground shadow-lg shadow-accent/20 transition hover:bg-accent/90"
            >
              Edit Drama
            </Link>

            <button
              type="button"
              onClick={handleDeleteDrama}
              className="rounded-full border border-destructive/50 px-5 py-2 text-sm font-medium text-destructive-foreground transition hover:bg-destructive/20"
            >
              Delete
            </button>
          </div>
        </div>

        <section className="relative overflow-hidden rounded-4xl border border-border bg-card shadow-2xl">
          {drama.posterUrl && (
            <img
              src={drama.posterUrl}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-44 hidden h-full w-full scale-110 object-cover opacity-20 blur-3xl md:block"
            />
          )}

          <div className="absolute inset-0 bg-linear-to-r from-card via-card/95 to-background/80" />

          <div className="relative grid md:grid-cols-[420px_1fr]">
            <div className="relative overflow-hidden bg-background shadow-2xl">
              {drama.posterUrl ? (
                <img
                  src={drama.posterUrl}
                  alt={`${drama.title} poster`}
                  className="h-full min-h-115 w-full object-cover"
                />
              ) : (
                <div className="flex min-h-115 items-center justify-center px-6 text-center text-sm text-muted-foreground">
                  No poster added yet
                </div>
              )}
              <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-linear-to-r from-transparent to-card md:block" />
            </div>

            <div className="min-w-0 flex flex-col justify-start p-6 pt-10 md:p-8 md:pt-16">
              <p className="mb-3 text-sm uppercase tracking-[0.35em] text-muted-foreground">
                Drama Details
              </p>

              <h1 className="mb-6 font-serif text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
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
                    {drama.status}
                  </p>
                </div>

                <div className="sm:px-4">
                  <p className="mb-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Rating
                  </p>
                  {drama.rating ? (
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
                    {drama.finishedAt || "Not finished"}
                  </p>
                </div>
              </div>

              {(drama.review || drama.notes) && (
                <div className="mt-8 grid gap-5">
                  {drama.review && (
                    <div className="rounded-xl border border-border/70 bg-background/40 p-5 shadow-xl backdrop-blur-md">
                      <div className="flex items-start gap-3">
                        <Quote className="mt-0.5 h-5 w-5 shrink-0 fill-accent text-accent" />
                        <div className="min-w-0">
                          <h3 className="mb-2 mt-0.5 text-sm text-accent/80">
                            Your Review
                          </h3>
                          <p className="no-scrollbar max-h-48 overflow-y-auto break-all leading-relaxed text-foreground/90 italic md:max-h-56">
                            {drama.review}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {drama.notes && (
                    <article className="rounded-3xl border border-border bg-background/70 p-6 shadow-xl">
                      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">
                        Notes
                      </p>

                      <p className="leading-8 text-foreground/90">
                        {drama.notes}
                      </p>
                    </article>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default DramaDetailsPage;
