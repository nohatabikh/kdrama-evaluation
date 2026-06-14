import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../../hooks/useAppSelector";
import DramaForm from "../components/DramaForm";

function EditDramaPage() {
  const { id } = useParams();

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
            Loading drama entry...
          </p>
        </div>
      </div>
    );
  }

  if (!drama) {
    return (
      <div className="min-h-screen bg-background px-5 py-10 text-foreground">
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
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8">
      <div className="pointer-events-none absolute -left-30 top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-35 top-72 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />

      <div className="relative z-10 mx-auto w-full min-w-0 max-w-3xl space-y-8">
        <div>
          <Link
            to={`/dramas/${drama.id}`}
            className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-accent hover:text-foreground"
          >
            &larr; Back to details
          </Link>
        </div>

        <section className="min-w-0 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Update Entry
          </p>

          <h1 className="min-w-0 max-w-full wrap-anywhere text-balance font-serif text-4xl font-bold text-foreground md:text-5xl">
            Editing {drama.title}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Refresh your progress, rating, poster, and review for this drama.
          </p>
        </section>

        <DramaForm initialDrama={drama} />
      </div>
    </div>
  );
}

export default EditDramaPage;
