import type { ReactNode } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import {
  createMemoryRouter,
  MemoryRouter,
  RouterProvider,
} from "react-router-dom";
import { beforeAll, describe, expect, it, vi } from "vitest";

import authReducer, { setAuthUser } from "../features/auth/store/authSlice";
import NotFoundPage from "./NotFoundPage";
import RouteErrorBoundary from "./RouteErrorBoundary";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

function createTestStore(isAuthenticated: boolean) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  });

  store.dispatch(
    setAuthUser(
      isAuthenticated
        ? {
            id: "user-1",
            name: "Noha",
            email: "noha@example.com",
          }
        : null,
    ),
  );

  return store;
}

function renderWithAuth(children: ReactNode, isAuthenticated: boolean) {
  return render(
    <Provider store={createTestStore(isAuthenticated)}>{children}</Provider>,
  );
}

describe("router fallbacks", () => {
  it("points logged-out users from the 404 page to login", () => {
    renderWithAuth(
      <MemoryRouter initialEntries={["/missing-page"]}>
        <NotFoundPage />
      </MemoryRouter>,
      false,
    );

    expect(
      screen.getByRole("heading", { name: /this page is not in your diary/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to login/i })).toHaveAttribute(
      "href",
      "/login",
    );
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("points authenticated users from the 404 page to the collection", () => {
    renderWithAuth(
      <MemoryRouter initialEntries={["/missing-page"]}>
        <NotFoundPage />
      </MemoryRouter>,
      true,
    );

    expect(
      screen.getByRole("link", { name: /back to collection/i }),
    ).toHaveAttribute("href", "/");
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("shows a friendly route error boundary", async () => {
    const router = createMemoryRouter(
      [
        {
          path: "/broken",
          element: <p>Broken route</p>,
          errorElement: <RouteErrorBoundary />,
          loader: () => {
            throw new Response("", {
              status: 500,
              statusText: "Demo failure",
            });
          },
        },
      ],
      {
        initialEntries: ["/broken"],
      },
    );

    renderWithAuth(<RouterProvider router={router} />, true);

    expect(
      await screen.findByRole("heading", { name: /this page needs a reset/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("500 Demo failure")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to collection/i }),
    ).toHaveAttribute("href", "/");
  });
});
