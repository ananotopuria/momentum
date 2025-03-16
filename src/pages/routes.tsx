import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import HomePage from "./homePage";
import CreatePage from "./createPage";
import NotFoundPage from "./notFoundPage";
import InnerPageComponents from "../components/InnerPageComponents";

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
        path: "tasks/:id",
        element: <InnerPageComponents />,
      },
      {
        path: "create",
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
