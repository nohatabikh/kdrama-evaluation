import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import DramaListPage from "../features/dramas/pages/DramaListPage";
import AddDramaPage from "../features/dramas/pages/AddDramaPage";
import DramaDetailsPage from "../features/dramas/pages/DramaDetailsPage";
import EditDramaPage from "../features/dramas/pages/EditDramaPage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,

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
