import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

type RecoveryPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  actionTo: string;
  ActionIcon: LucideIcon;
};

function RecoveryPanel({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
  ActionIcon,
}: RecoveryPanelProps) {
  return (
    <section className="relative w-full max-w-2xl rounded-3xl border border-border/60 bg-card/55 px-6 py-12 text-center shadow-2xl shadow-black/30 backdrop-blur-2xl sm:px-10">
      <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-accent">
        {eyebrow}
      </p>

      <h1 className="font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
        {title}
      </h1>

      <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
        {description}
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          to={actionTo}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/10 transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 sm:w-auto"
        >
          <ActionIcon className="h-4 w-4" aria-hidden="true" />
          {actionLabel}
        </Link>
      </div>
    </section>
  );
}

export default RecoveryPanel;
