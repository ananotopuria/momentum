import { useEffect } from "react";
import { useStatuses } from "../../../hooks/useStatuses";
import { useTasks } from "../../../hooks/useTasks";
import Task from "../Task";
import { StatusTasksBoardProps } from "../types";

const StatusTasksBoard: React.FC<StatusTasksBoardProps> = ({
  filters,
  setFilters,
}) => {
  const {
    data: statuses = [],
    isLoading: isLoadingStatuses,
    isError: isErrorStatuses,
  } = useStatuses();
  const {
    data: tasks = [],
    isLoading: isLoadingTasks,
    isError: isErrorTasks,
  } = useTasks();

  useEffect(() => {
    const savedFilters = localStorage.getItem("taskFilters");
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }
  }, [setFilters]);

  useEffect(() => {
    localStorage.setItem("taskFilters", JSON.stringify(filters));
  }, [filters]);

  if (isLoadingStatuses || isLoadingTasks) return <p>Loading tasks...</p>;
  if (isErrorStatuses || isErrorTasks) return <p>Failed to load tasks.</p>;

  const statusColors: string[] = ["#F7BC30", "#FB5607", "#FF006E", "#3A86FF"];

  const noFiltersApplied =
    filters.departments.length === 0 &&
    filters.priorities.length === 0 &&
    filters.assignee === "";

  const filteredTasks = tasks.filter((task) => {
    const matchesDepartment =
      filters.departments.length === 0 ||
      filters.departments.includes(task.department?.name || "");

    const matchesPriority =
      filters.priorities.length === 0 ||
      filters.priorities.includes(task.priority?.name || "");

    const matchesAssignee =
      filters.assignee === "" ||
      filters.assignee ===
        `${task.employee?.name || ""} ${task.employee?.surname || ""}`;

    return (
      noFiltersApplied ||
      (matchesDepartment && matchesPriority && matchesAssignee)
    );
  });

  return (
    <section className="flex flex-wrap gap-8 px-[12rem] mt-[7.9rem]">
      {statuses.length === 0 ? (
        <p className="text-center text-gray-500">No statuses found</p>
      ) : (
        statuses.map((taskStatus, index) => {
          const tasksForStatus = filteredTasks.filter(
            (task) => Number(task.status?.id) === Number(taskStatus.id)
          );

          return (
            <div key={taskStatus.id} className="w-[38rem]">
              <div
                className="py-3 px-6 rounded-xl text-white text-center"
                style={{
                  backgroundColor: statusColors[index % statusColors.length],
                }}
              >
                <h2 className="text-[1.8rem] font-[500]">{taskStatus.name}</h2>
              </div>
              {tasksForStatus.length > 0 ? (
                <ul className="space-y-4 mt-4">
                  {tasksForStatus.map((task) => (
                    <Task key={task.id} task={task} />
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center mt-4">
                  დავალება არ მოიძებნა
                </p>
              )}
            </div>
          );
        })
      )}
    </section>
  );
};

export default StatusTasksBoard;
