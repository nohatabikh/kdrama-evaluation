const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const EXPLICIT_LOGOUT_STORAGE_KEY = "kdrama-tracker-explicit-logout";

export function markExplicitLogout(destination: string): void {
  sessionStorage.setItem(EXPLICIT_LOGOUT_STORAGE_KEY, destination);
}

const getExplicitLogoutDestination = (): string | null =>
  sessionStorage.getItem(EXPLICIT_LOGOUT_STORAGE_KEY);

const getRouteStateDestination = (routeState: unknown): string | null => {
  if (!isRecord(routeState) || !isRecord(routeState.from)) {
    return null;
  }

  const { pathname, search, hash } = routeState.from;

  if (
    typeof pathname !== "string" ||
    !pathname.startsWith("/") ||
    pathname.startsWith("//")
  ) {
    return null;
  }

  return `${pathname}${typeof search === "string" ? search : ""}${
    typeof hash === "string" ? hash : ""
  }`;
};

export function getAuthDestination(routeState: unknown): string {
  const destination = getRouteStateDestination(routeState);
  const explicitLogoutDestination = getExplicitLogoutDestination();

  if (
    explicitLogoutDestination &&
    (!destination || destination === explicitLogoutDestination)
  ) {
    return "/";
  }

  return destination ?? "/";
}

export function consumeAuthDestination(routeState: unknown): string {
  const destination = getAuthDestination(routeState);

  sessionStorage.removeItem(EXPLICIT_LOGOUT_STORAGE_KEY);

  return destination;
}

export function shouldPreserveProtectedDestination(
  destination: string,
): boolean {
  return getExplicitLogoutDestination() !== destination;
}
