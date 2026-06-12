import { LogOut, UserRound } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { logout } from "../../features/auth/store/authThunks";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { clearUserDramas } from "../../features/dramas/store/dramaSlice";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const firstName = user?.name.trim().split(/\s+/)[0] || "there";

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

  const handleLogout = () => {
    dispatch(clearUserDramas());
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-background/55 backdrop-blur-2xl transition-shadow duration-200 supports-backdrop-filter:bg-background/40 ${
        isScrolled ? "shadow-lg shadow-black/10" : "shadow-none"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-5 sm:px-0">
        <NavLink
          to="/"
          className="group flex min-w-0 items-center gap-2"
          aria-label="My Tracker home"
        >
          <img
            src="/assets/cherry-blossom.svg"
            alt=""
            className="relative z-10 size-7 shrink-0 sm:size-8"
            aria-hidden="true"
          />

          <span className="relative hidden min-w-0 sm:-ml-5 sm:block">
            <span className="block truncate font-serif text-xl font-semibold leading-tight tracking-tight text-foreground">
              Drama Diary
            </span>
          </span>
        </NavLink>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-5">
            <NavLink to="/" className={navLinkClass}>
              Collection
            </NavLink>
            <NavLink to="/dramas/add" className={navLinkClass}>
              Add Drama
            </NavLink>
          </div>

          <span className="h-5 w-px bg-border/80" aria-hidden="true" />

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-card/70 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 data-[state=open]:bg-card/70 data-[state=open]:text-accent"
                aria-label={`Open account menu for ${user?.name ?? firstName}`}
              >
                <UserRound className="size-5" aria-hidden="true" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="z-60 min-w-56 rounded-xl border border-border/80 bg-popover/95 p-1.5 text-popover-foreground shadow-xl shadow-black/30 backdrop-blur-xl data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
              >
                <div className="px-2.5 py-2">
                  <p className="truncate text-sm font-medium">{user?.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>

                <DropdownMenu.Separator className="my-1 h-px bg-border/70" />

                <DropdownMenu.Item
                  onSelect={handleLogout}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground outline-none transition-colors focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Log out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
