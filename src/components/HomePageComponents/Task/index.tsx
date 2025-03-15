import { Link } from "react-router-dom";
import { Task as TaskType } from "../../../hooks/useTasks";
import { GoComment } from "react-icons/go";

interface TaskProps {
  task: TaskType;
}

function Task({ task }: TaskProps) {
  return (
    <Link to={`/tasks/${task.id}`} className="block">
      <li className="border p-8 rounded flex flex-col items-start hover:shadow-lg transition-shadow">
        <div className="w-full flex justify-between">
          <div className="flex gap-8">
            <div>{task.priority.name}</div>
            <div>{task.department.name}</div>
          </div>
          <div>{new Date(task.due_date).toLocaleDateString()}</div>
        </div>
        <div className="flex flex-col mt-[5.8rem]">
          <h3 className="text-[1.5rem] font-[500] text-grey leading-[100%]">
            {task.name}
          </h3>
          <p className="text-[1.4rem] font-normal text-darkGrey leading-[100%] mt-[1.2rem] text-justify">
            {task.description}
          </p>
        </div>
        <div className="w-full flex justify-between mt-[2.8rem]">
          <img
            className="w-12 h-12 rounded-full"
            src={task.employee.avatar}
            alt="employee avatar"
          />
          <div className="flex items-center gap-2">
            <GoComment />
            {task.total_comments}
          </div>
        </div>
      </li>
    </Link>
  );
}

export default Task;
