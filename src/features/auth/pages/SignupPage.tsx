import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  User,
} from "lucide-react";

import { signup } from "../store/authThunks";
import { isStrongPassword } from "../services/authService";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { consumeAuthDestination } from "../utils/authNavigation";

const passwordRequirements = [
  { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { label: "One number", test: (value: string) => /\d/.test(value) },
  {
    label: "One special character",
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
] as const;

function SignupPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const passwordStrength = passwordRequirements.filter((requirement) =>
    requirement.test(password),
  ).length;
  const passwordStrengthLabel =
    passwordStrength === 0
      ? ""
      : passwordStrength <= 2
        ? "Weak"
        : passwordStrength === 3
          ? "Fair"
          : passwordStrength === 4
            ? "Good"
            : "Strong";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!isStrongPassword(password)) {
      setErrorMessage("Password does not meet the security requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      dispatch(
        signup({
          name,
          email,
          password,
        }),
      );

      const destination = consumeAuthDestination(location.state);
      navigate(destination, { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  };

  return (
    <section className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-border/60 bg-card/55 shadow-2xl shadow-black/30 backdrop-blur-2xl">
      <div className="pointer-events-none absolute -left-24 -top-24 hidden h-72 w-72 rounded-full bg-accent/18 blur-3xl sm:block" />
      <div className="pointer-events-none absolute -bottom-28 right-8 hidden h-80 w-80 rounded-full bg-primary/10 blur-3xl sm:block" />

      <div className="relative grid min-h-165 lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="hidden border-r border-border/50 bg-background/35 p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link to="/" className="inline-flex items-center gap-0 -ml-4">
              <img
                src="/assets/cherry-blossom.svg"
                alt=""
                className="relative z-10 size-12 shrink-0"
                aria-hidden="true"
              />
              <span className="font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground">
                Drama Diary
              </span>
            </Link>

            <div className="mt-16">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-accent">
                <Sparkles className="h-3.5 w-3.5" />
                New watchlist
              </p>

              <h1 className="max-w-sm font-serif text-[2.9rem] font-semibold leading-tight text-foreground">
                Build a diary for every drama.
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
                Save what you watched, what you loved, and what belongs in your
                next late-night queue.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/55 p-5 shadow-lg shadow-black/10">
            <p className="font-serif text-xl text-primary">
              First entry awaits
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Create your account, then start curating a collection that feels
              personal.
            </p>
          </div>
        </aside>

        <div className="flex items-center justify-center px-7 py-12 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link to="/" className="mb-8 inline-flex items-center gap-0">
                <img
                  src="/assets/cherry-blossom.svg"
                  alt=""
                  className="relative z-10 size-11 shrink-0"
                  aria-hidden="true"
                />
                <span className="font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground">
                  Drama Diary
                </span>
              </Link>

              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-accent">
                <Sparkles className="h-3.5 w-3.5" />
                New watchlist
              </p>

              <h1 className="font-serif text-[2.3rem] font-semibold leading-tight text-foreground">
                Build a diary for every drama.
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Save what you watched, what you loved, and what belongs in your
                next late-night queue.
              </p>
            </div>

            <div className="mb-8 hidden lg:block">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground/70">
                Sign up
              </p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-primary">
                Start your collection
              </h2>
            </div>

            <p className="mb-6 rounded-2xl border border-accent/25 bg-accent/10 px-4 py-3 text-sm leading-6 text-muted-foreground">
              <span className="font-medium text-accent">Portfolio demo:</span>{" "}
              use a fake password. Accounts are stored locally in this browser.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground"
                >
                  Name
                </label>

                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    className="h-12 w-full rounded-2xl border border-border/70 bg-background/50 pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-2xl border border-border/70 bg-background/50 pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a password"
                    className="h-12 w-full rounded-2xl border border-border/70 bg-background/50 pl-11 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((isVisible) => !isVisible)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex flex-1 gap-1"
                      role="progressbar"
                      aria-label="Password strength"
                      aria-valuemin={0}
                      aria-valuemax={5}
                      aria-valuenow={passwordStrength}
                    >
                      {Array.from({ length: 5 }, (_, index) => (
                        <span
                          key={index}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            index < passwordStrength
                              ? "bg-accent"
                              : "bg-border/70"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="w-11 text-right text-xs text-accent">
                      {passwordStrengthLabel}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    8+ characters with uppercase, lowercase, number, and symbol
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-foreground"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm your password"
                    className="h-12 w-full rounded-2xl border border-border/70 bg-background/50 pl-11 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-accent focus:ring-2 focus:ring-accent/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((isVisible) => !isVisible)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    aria-pressed={showConfirmPassword}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <p className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                className="group mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/10 transition hover:bg-accent"
              >
                Sign up
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                state={location.state}
                className="font-medium text-accent transition hover:text-primary"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignupPage;
