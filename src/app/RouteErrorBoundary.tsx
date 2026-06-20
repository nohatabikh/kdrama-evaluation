import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { AlertTriangle, Home, LogIn, RefreshCcw } from "lucide-react";

import PetalOverlay from "../components/visual/PetalOverlay";
import { useAppSelector } from "../hooks/useAppSelector";

function RouteErrorBoundary() {
  const error = useRouteError();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const destination = isAuthenticated ? "/" : "/login";
  const destinationLabel = isAuthenticated
    ? "Back to collection"
    : "Go to login";
  const DestinationIcon = isAuthenticated ? Home : LogIn;

  const description = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText || "Route error"}`
    : "Something interrupted this page before it could finish loading.";

  return (
    <>
      <PetalOverlay />

      <main className="relative z-20 flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
        <div className="pointer-events-none absolute -left-30 top-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-35 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />

        <section className="relative w-full max-w-2xl rounded-3xl border border-border/60 bg-card/55 px-6 py-12 text-center shadow-2xl shadow-black/30 backdrop-blur-2xl sm:px-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
            <AlertTriangle className="h-7 w-7" aria-hidden="true" />
          </div>

          <h1 className="font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            This page needs a reset.
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
            {description}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to={destination}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/10 transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 sm:w-auto"
            >
              <DestinationIcon className="h-4 w-4" aria-hidden="true" />
              {destinationLabel}
            </Link>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border/70 bg-background/30 px-5 text-sm font-semibold text-foreground transition-colors hover:border-accent/60 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 sm:w-auto"
            >
              <RefreshCcw className="h-4 w-4" aria-hidden="true" />
              Reload page
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

export default RouteErrorBoundary;
