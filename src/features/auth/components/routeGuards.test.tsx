import type { ReactNode } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { describe, expect, it } from "vitest";

import authReducer, { setAuthUser } from "../store/authSlice";
import {
  consumeAuthDestination,
  getAuthDestination,
  markExplicitLogout,
  shouldPreserveProtectedDestination,
} from "../utils/authNavigation";
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";

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

function LoginDestination() {
  const location = useLocation();

  return <p>Destination: {getAuthDestination(location.state)}</p>;
}

function LoginRouteState() {
  const location = useLocation();

  return <p>{location.state ? "Has destination" : "No destination"}</p>;
}

describe("authentication route guards", () => {
  it("preserves the intended protected destination for logged-out users", () => {
    renderWithAuth(
      <MemoryRouter initialEntries={["/dramas/add?source=quick#form"]}>
        <Routes>
          <Route path="/login" element={<LoginDestination />} />
          <Route
            path="/dramas/add"
            element={
              <ProtectedRoute>
                <p>Add drama</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
      false,
    );

    expect(
      screen.getByText("Destination: /dramas/add?source=quick#form"),
    ).toBeInTheDocument();
  });

  it("redirects authenticated users away from guest-only routes", () => {
    renderWithAuth(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/" element={<p>Collection</p>} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <p>Login</p>
              </GuestRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
      true,
    );

    expect(screen.getByText("Collection")).toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  it("falls back to the collection for missing or unsafe route state", () => {
    expect(getAuthDestination(undefined)).toBe("/");
    expect(
      getAuthDestination({
        from: {
          pathname: "//external.example",
        },
      }),
    ).toBe("/");
  });

  it("clears the intended destination after an explicit logout", () => {
    const routeState = {
      from: {
        pathname: "/dramas/user-a-drama",
      },
    };

    markExplicitLogout("/dramas/user-a-drama");

    expect(
      shouldPreserveProtectedDestination("/dramas/user-a-drama"),
    ).toBe(false);
    expect(getAuthDestination(routeState)).toBe("/");
    expect(consumeAuthDestination(routeState)).toBe("/");
    expect(getAuthDestination(routeState)).toBe("/dramas/user-a-drama");
  });

  it("preserves a protected URL intentionally opened after logout", () => {
    markExplicitLogout("/dramas/user-a-drama");

    const routeState = {
      from: {
        pathname: "/dramas/add",
      },
    };

    expect(shouldPreserveProtectedDestination("/dramas/add")).toBe(true);
    expect(consumeAuthDestination(routeState)).toBe("/dramas/add");
    expect(getAuthDestination(routeState)).toBe("/dramas/add");
  });

  it("does not rebuild the logged-out drama URL as route state", () => {
    markExplicitLogout("/dramas/user-a-drama");

    renderWithAuth(
      <MemoryRouter initialEntries={["/dramas/user-a-drama"]}>
        <Routes>
          <Route path="/login" element={<LoginRouteState />} />
          <Route
            path="/dramas/:id"
            element={
              <ProtectedRoute>
                <p>Drama details</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
      false,
    );

    expect(screen.getByText("No destination")).toBeInTheDocument();
  });
});
