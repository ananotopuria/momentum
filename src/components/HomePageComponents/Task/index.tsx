import { Link } from "react-router-dom";
import { Task as TaskType } from "../../../hooks/useTasks";
import { GoComment } from "react-icons/go";

interface TaskProps {
  task: TaskType;
  borderColor?: string;
  departmentColor?: string;
}

function Task({ task, borderColor, departmentColor }: TaskProps) {
  return (
    <Link to={`/tasks/${task.id}`} className="block">
      <li
        className="border rounded-3xl p-8 flex flex-col items-start hover:shadow-lg transition-shadow mt-[3rem]"
        style={{ borderColor: borderColor }}
      >
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div
              className={`
                flex items-center px-[0.4rem] py-[0.2rem] border rounded-md text-[1.2rem] font-medium leading-[1.5]
                ${
                  task?.priority?.name === "მაღალი"
                    ? "text-red border-red"
                    : task?.priority?.name === "საშუალო"
                    ? "text-yellow border-yellow"
                    : task?.priority?.name === "დაბალი"
                    ? "text-green border-green"
                    : "text-grey border-grey"
                }
              `}
            >
              <img
                src={task?.priority?.icon || "/default-priority-icon.png"}
                alt="Priority"
                className="w-8 h-8 mr-1"
              />
              <div>{task?.priority?.name || "პრიორიტეტი ვერ მოიძებნა"}</div>
            </div>
            <div
              className="px-[1rem] py-[1rem] rounded-3xl text-white text-xs"
              style={{ backgroundColor: departmentColor || "#C9A7EB" }}
            >
              {task.department?.name || "No Department"}
            </div>
          </div>
          <div>{new Date(task.due_date).toLocaleDateString()}</div>
        </div>
        <div className="flex flex-col mt-[2.8rem]">
          <h3 className="text-[1.5rem] font-[500] text-grey leading-[100%]">
            {task.name}
          </h3>
          <p className="text-[1.4rem] font-normal text-darkGrey leading-[100%] mt-[1.2rem] text-justify">
            {task.description}
          </p>
        </div>
        <div className="w-full flex justify-between mt-[2.8rem]">
          {task.employee?.avatar ? (
            <img
              className="w-12 h-12 rounded-full"
              src={task.employee.avatar}
              alt="employee avatar"
            />
          ) : (
            <p>სურათი არ იძებნება</p>
          )}
          <div className="flex items-center gap-2">
            <GoComment />
            {task.total_comments ?? 0}
          </div>
        </div>
      </li>
    </Link>
  );
}

export default Task;
