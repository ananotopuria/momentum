import { useTasks } from "../../../hooks/useTasks";
import Task from "./../Task";

function TasksList() {
  const { data: tasks = [], isLoading, isError } = useTasks();

  if (isLoading) return <p>Loading tasks...</p>;
  if (isError) return <p>Failed to load tasks.</p>;

  return (
    <div className="p-8">
      <ul className="space-y-4">
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
}

export default TasksList;
