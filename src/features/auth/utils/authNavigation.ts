const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export function getAuthDestination(routeState: unknown): string {
  if (!isRecord(routeState) || !isRecord(routeState.from)) {
    return "/";
  }

  const { pathname, search, hash } = routeState.from;

  if (
    typeof pathname !== "string" ||
    !pathname.startsWith("/") ||
    pathname.startsWith("//")
  ) {
    return "/";
  }

  return `${pathname}${typeof search === "string" ? search : ""}${
    typeof hash === "string" ? hash : ""
  }`;
}
