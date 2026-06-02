import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SakuraIcon } from "@hugeicons/core-free-icons";

const BrandSakuraIcon = [
  [
    SakuraIcon[1][0],
    { ...SakuraIcon[1][1], fill: "currentColor", fillOpacity: 0.6 },
  ],
] as typeof SakuraIcon;

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "text-sm font-medium transition-all duration-200 hover:text-accent hover:[text-shadow:0_0_16px_rgba(193,160,172,0.55)]",
      isActive
        ? "text-accent [text-shadow:0_0_14px_rgba(193,160,172,0.45)]"
        : "text-muted-foreground/70",
    ].join(" ");

  return (
    <header
      className={`sticky top-0 z-50 bg-background/55 backdrop-blur-2xl transition-shadow duration-200 supports-[backdrop-filter]:bg-background/40 ${
        isScrolled ? "shadow-lg shadow-black/10" : "shadow-none"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <NavLink
          to="/"
          className="group flex min-w-0 items-center gap-2"
          aria-label="My Tracker home"
        >
          <HugeiconsIcon
            icon={BrandSakuraIcon}
            size={22}
            color="currentColor"
            strokeWidth={1.7}
            className="shrink-0 text-accent drop-shadow-[0_0_5px_rgba(193,160,172,0.22)]"
          />
          <span className="hidden min-w-0 sm:block">
            <span
              className="brand-title-shimmer block truncate font-serif text-lg font-medium leading-tight text-primary"
              data-text="Kdrama Tracker"
            >
              Kdrama Tracker
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
