import { NavLink } from "react-router-dom";

function Navbar() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "text-sm font-medium transition-all duration-200 hover:text-accent hover:[text-shadow:0_0_16px_rgba(193,160,172,0.55)]",
      isActive
        ? "text-accent [text-shadow:0_0_14px_rgba(193,160,172,0.45)]"
        : "text-muted-foreground/70",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/55 shadow-lg shadow-black/10 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/40">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <NavLink
          to="/"
          className="group flex min-w-0 items-center gap-0"
          aria-label="My Tracker home"
        >
          <img
            src="/logo.png"
            alt="Kdrama Evaluation logo"
            className="h-12 w-12 shrink-0 rotate-6 object-contain transition duration-300 group-hover:brightness-110"
          />
          <span className="mt-2 hidden min-w-0 sm:block">
            <span
              className="brand-title-shimmer block truncate font-sans text-lg font-medium leading-tight text-accent"
              data-text="My Kdrama Tracker"
            >
              My Kdrama Tracker
            </span>
          </span>
        </NavLink>

        <div className="flex shrink-0 items-center gap-5">
          <NavLink to="/" className={navLinkClass}>
            Collection
          </NavLink>
          <NavLink to="/dramas/add" className={navLinkClass}>
            Add Drama
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
