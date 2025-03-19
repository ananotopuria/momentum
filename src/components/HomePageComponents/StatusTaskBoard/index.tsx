import { useEffect } from "react";
import { useStatuses } from "../../../hooks/useStatuses";
import { useTasks } from "../../../hooks/useTasks";
import { useDepartments } from "../../../hooks/useDepartments";
import Task from "../Task";
import { StatusTasksBoardProps } from "../types";

function StatusTasksBoard({ filters, setFilters }: StatusTasksBoardProps) {
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
  const {
    data: departments = [],
    isLoading: isLoadingDepartments,
    isError: isErrorDepartments,
  } = useDepartments();

  useEffect(() => {
    const savedFilters = localStorage.getItem("taskFilters");
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }
  }, [setFilters]);

  useEffect(() => {
    localStorage.setItem("taskFilters", JSON.stringify(filters));
  }, [filters]);

  if (isLoadingStatuses || isLoadingTasks || isLoadingDepartments)
    return <p className="">Loading tasks...</p>;
  if (isErrorStatuses || isErrorTasks || isErrorDepartments)
    return <p>Failed to load tasks.</p>;

  const statusColors: Record<number, string> = {
    1: "#F7BC30",
    2: "#FB5607",
    3: "#FF006E",
    4: "#3A86FF",
  };

  const noFiltersApplied =
    filters.departments.length === 0 &&
    filters.priorities.length === 0 &&
    filters.assignee.length === 0;

  const filteredTasks = tasks.filter((task) => {
    const matchesDepartment =
      filters.departments.length === 0 ||
      filters.departments.includes(task.department?.name || "");

    const matchesPriority =
      filters.priorities.length === 0 ||
      filters.priorities.includes(task.priority?.name || "");

    const fullName = `${task.employee?.name || ""} ${
      task.employee?.surname || ""
    }`.trim();
    const matchesAssignee =
      filters.assignee.length === 0 || filters.assignee.includes(fullName);

    return (
      noFiltersApplied ||
      (matchesDepartment && matchesPriority && matchesAssignee)
    );
  });

  return (
    <section className="flex justify-between gap-8 px-[12rem] mt-[7.9rem]">
      {statuses.length === 0 ? (
        <p className="text-center text-gray-500">No statuses found</p>
      ) : (
        statuses.map((taskStatus) => {
          const tasksForStatus = filteredTasks.filter(
            (task) => Number(task.status?.id) === Number(taskStatus.id)
          );

          return (
            <div key={taskStatus.id} className="w-[38rem]">
              <div
                className="py-3 px-6 rounded-xl text-white text-center"
                style={{
                  backgroundColor: statusColors[taskStatus.id] || "#C9A7EB",
                }}
              >
                <h2 className="text-[1.8rem] font-[500]">{taskStatus.name}</h2>
              </div>
              {tasksForStatus.length > 0 ? (
                <ul className="space-y-4 mt-[3rem]">
                  {tasksForStatus.map((task) => {
                    const departmentColor =
                      departments.find(
                        (dept) => dept.id === task.department?.id
                      )?.color || "#C9A7EB";

                    const borderColor =
                      statusColors[task.status?.id] || "#D1D5DB";

                    return (
                      <Task
                        key={task.id}
                        task={task}
                        borderColor={borderColor}
                        departmentColor={departmentColor}
                      />
                    );
                  })}
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
}

export default StatusTasksBoard;
