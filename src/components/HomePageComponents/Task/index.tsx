import { Task as TaskType } from "../../../hooks/useTasks";
interface TaskProps {
  task: TaskType;
}

function Task({ task }: TaskProps) {
  return (
    <li key={task.id} className="border p-4 rounded shadow">
      <h2 className="text-2xl font-semibold">{task.name}</h2>
      <p>{task.description}</p>
      <p>
        <strong>Due Date:</strong>
        {new Date(task.due_date).toLocaleDateString()}
      </p>
      <p>
        <strong>Department:</strong> {task.department.name}
      </p>
      <p>
        <strong>Employee:</strong> {task.employee.name} {task.employee.surname}
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
  );
}

export default Task;
