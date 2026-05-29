import { useAppSelector } from "../../../hooks/useAppSelector";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteDrama } from "../store/dramaSlice";
import { useAppDispatch } from "../../../hooks/useAppDispatch";

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
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground shadow-lg shadow-black/20 transition hover:bg-accent/90"
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

        <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-black/30">
          <div className="grid gap-8 p-6 md:grid-cols-[280px_1fr] md:p-8">
            <div className="overflow-hidden rounded-3xl border border-border bg-background">
              {drama.posterUrl ? (
                <img
                  src={drama.posterUrl}
                  alt={`${drama.title} poster`}
                  className="h-full min-h-[420px] w-full object-cover"
                />
              ) : (
                <div className="flex min-h-[420px] items-center justify-center px-6 text-center text-sm text-muted-foreground">
                  No poster added yet
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <p className="mb-3 text-sm uppercase tracking-[0.35em] text-muted-foreground">
                Drama Details
              </p>

              <h1 className="mb-5 text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
                {drama.title}
              </h1>

              {drama.genres.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {drama.genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-secondary-foreground"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <p className="mb-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Status
                  </p>
                  <p className="text-lg font-medium">{drama.status}</p>
                </div>

                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <p className="mb-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Rating
                  </p>
                  <p className="text-lg font-medium">
                    {drama.rating ? `${drama.rating}/10` : "Not rated"}
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <p className="mb-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Finished
                  </p>
                  <p className="text-lg font-medium">
                    {drama.finishedAt || "Not finished"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {(drama.review || drama.notes) && (
          <section className="mt-8 grid gap-6 md:grid-cols-2">
            {drama.review && (
              <article className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-black/20">
                <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">
                  Review
                </p>

                <p className="leading-8 text-foreground/90">{drama.review}</p>
              </article>
            )}

            {drama.notes && (
              <article className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-black/20">
                <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">
                  Notes
                </p>

                <p className="leading-8 text-foreground/90">{drama.notes}</p>
              </article>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default DramaDetailsPage;
