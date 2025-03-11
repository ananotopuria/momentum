import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import HomePage from "./homePage";
import InnerPage from "./innerPage";
import CreatePage from "./createPage";
import NotFoundPage from "./notFoundPage";

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
