import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import HomePage from "./HomePage";
import InnerPage from "./InnerPage";
import CreatePage from "./CreatePage";
import NotFoundPage from "./NotFoundPage";

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "/inner",
        element: <InnerPage />,
      },
      {
        path: "/create",
        element: <CreatePage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
