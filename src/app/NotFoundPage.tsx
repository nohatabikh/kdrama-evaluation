import { Home, LogIn } from "lucide-react";

import RecoveryPanel from "../components/layout/RecoveryPanel";
import PetalOverlay from "../components/visual/PetalOverlay";
import { useAppSelector } from "../hooks/useAppSelector";

function NotFoundPage() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const actionLabel = isAuthenticated ? "Back to collection" : "Back to login";
  const actionTo = isAuthenticated ? "/" : "/login";
  const ActionIcon = isAuthenticated ? Home : LogIn;

  return (
    <>
      <PetalOverlay />

      <main className="relative z-20 flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
        <div className="pointer-events-none absolute -left-30 top-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-35 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />

        <RecoveryPanel
          eyebrow="404"
          title="This page is not in your diary."
          description="The link may be old, mistyped, or no longer part of Drama Diary."
          actionLabel={actionLabel}
          actionTo={actionTo}
          ActionIcon={ActionIcon}
        />
      </main>
    </>
  );
}

export default NotFoundPage;
