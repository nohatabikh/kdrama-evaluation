import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";

import GuestRoute from "../features/auth/components/GuestRoute";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import LoginPage from "../features/auth/pages/LoginPage";
import SignupPage from "../features/auth/pages/SignupPage";

import DramaListPage from "../features/dramas/pages/DramaListPage";
import AddDramaPage from "../features/dramas/pages/AddDramaPage";
import DramaDetailsPage from "../features/dramas/pages/DramaDetailsPage";
import EditDramaPage from "../features/dramas/pages/EditDramaPage";

export const router = createBrowserRouter([
  {
    element: (
      <GuestRoute>
        <AuthLayout />
      </GuestRoute>
    ),
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <DramaListPage />,
      },
      {
        path: "/dramas/add",
        element: <AddDramaPage />,
      },
      {
        path: "/dramas/:id",
        element: <DramaDetailsPage />,
      },
      {
        path: "/dramas/:id/edit",
        element: <EditDramaPage />,
      },
    ],
  },
]);
