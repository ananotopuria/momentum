import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import HomePage from "./homePage";
import TaskDetails from "./../components/InnerPageComponents/TaskDetails"; 
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
        path: "tasks/:id",
        element: <TaskDetails />,
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
