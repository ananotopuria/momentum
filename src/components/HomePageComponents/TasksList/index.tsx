import { useTasks } from "../../../hooks/useTasks";

function TasksList() {
  const { data: tasks = [], isLoading, isError } = useTasks();

  if (isLoading) return <p>Loading tasks...</p>;
  if (isError) return <p>Failed to load tasks.</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">All Tasks</h1>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="border p-4 rounded shadow">
            <h2 className="text-2xl font-semibold">{task.name}</h2>
            <p>{task.description}</p>
            <p>
              <strong>Due Date:</strong>{" "}
              {new Date(task.due_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Department:</strong> {task.department.name}
            </p>
            <p>
              <strong>Employee:</strong> {task.employee.name}{" "}
              {task.employee.surname}
            </p>
            <p>
              <strong>Status:</strong> {task.status.name}
            </p>
            <p>
              <strong>Priority:</strong> {task.priority.name}
            </p>
            <p>
              <strong>Total Comments:</strong> {task.total_comments}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TasksList;
