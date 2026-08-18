import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./App.jsx";
import TaskBoard from "./pages/TaskBoard.jsx";
import ViewTask from "./components/Viewtask.jsx";
import EditTask from "./pages/EditTask.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [{ index: true, element: <TaskBoard /> }],
  },
  { path: "/tasks/:id", element: <ViewTask /> },
  { path: "/tasks/:id/edit", element: <EditTask /> },
]);

export default router;