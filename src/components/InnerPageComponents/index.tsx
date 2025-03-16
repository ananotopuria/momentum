import CommentsSection from "./CommentsSection";
import TaskDetails from "./TaskDetails";
import { useParams } from "react-router-dom";

function InnerPageComponents() {
  const { id } = useParams<{ id: string }>();

  return (
    <main className="px-[12rem] flex justify-between">
      <TaskDetails />
      {id ? <CommentsSection taskId={id} /> : <p>No task ID found.</p>}
      <h1>Task Details for {id}</h1>;
    </main>
  );
}

export default InnerPageComponents;
