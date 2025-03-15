import React from "react";
import { useStatuses } from "../../../hooks/useStatuses";
import { useTasks } from "../../../hooks/useTasks";
import Task from "../Task";

const StatusTasksBoard: React.FC = () => {
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

  if (isLoadingStatuses || isLoadingTasks) return <p>Loading...</p>;
  if (isErrorStatuses || isErrorTasks) return <p>Failed to load data.</p>;

  const statusColors: string[] = ["#F7BC30", "#FB5607", "#FF006E", "#3A86FF"];

  return (
    <section className="flex justify-between p-[12rem]">
      {statuses.map((status, index) => {
        const tasksForStatus = tasks.filter(
          (task) => task.status.id === status.id
        );

        return (
          <div key={status.id} className="mb-8 w-[38rem]">
            <div
              className="py-3 px-6 rounded-xl text-white text-center"
              style={{
                backgroundColor: statusColors[index % statusColors.length],
              }}
            >
              <h2 className="text-[1.8rem] font-[500]">{status.name}</h2>
            </div>
            {tasksForStatus.length > 0 ? (
              <ul className="space-y-4 mt-4">
                {tasksForStatus.map((task) => (
                  <Task key={task.id} task={task} />
                ))}
              </ul>
            ) : (
              <p></p>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default StatusTasksBoard;
