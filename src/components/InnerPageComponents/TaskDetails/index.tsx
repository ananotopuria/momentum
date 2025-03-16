import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Task } from "../../../hooks/useTasks";
import { useStatuses } from "../../../hooks/useStatuses";

const fetchTaskById = async (id: string): Promise<Task> => {
  const response = await axios.get(
    `https://momentum.redberryinternship.ge/api/tasks/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 9e69afcb-2aa2-4cb2-9841-a898e8708a26`,
      },
    }
  );
  return response.data;
};

function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: statuses = [] } = useStatuses();

  const {
    data: task,
    isLoading,
    error,
  } = useQuery<Task>({
    queryKey: ["task", id],
    queryFn: () => fetchTaskById(id!),
    enabled: !!id,
  });

  const [selectedStatus, setSelectedStatus] = useState<number | undefined>();

  useEffect(() => {
    if (task && selectedStatus === undefined) {
      setSelectedStatus(task.status.id);
    }
  }, [task, selectedStatus]);

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatusId: number) => {
      await axios.put(
        `https://momentum.redberryinternship.ge/api/tasks/${id}`,
        { status_id: newStatusId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 9e69afcb-2aa2-4cb2-9841-a898e8708a26`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
  });

  if (isLoading) return <p>Loading task details...</p>;
  if (error) return <p>Error loading task details</p>;

  return (
    <section className="w-[71.5rem] mt-[4rem]">
      <h1 className="text-3xl font-bold mb-4">{task?.name || "დავალება"}</h1>
      <p className="mb-4">{task?.description || "აღწერა არ არის"}</p>
      <div className="mb-8">
        <label className="block text-lg font-medium mb-2">Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => {
            const newStatus = Number(e.target.value);
            setSelectedStatus(newStatus);
            updateStatusMutation.mutate(newStatus);
          }}
          className="border p-2 rounded w-full"
        >
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>
      </div>
      <p>
        <strong>Assigned to:</strong> {task?.employee.name}{" "}
        {task?.employee.surname}
      </p>
      <div className="flex items-center mt-4">
        <img
          src={task?.priority.icon}
          alt="Priority"
          className="w-6 h-6 mr-2"
        />
        <p>
          <strong>Priority:</strong> {task?.priority.name}
        </p>
      </div>
    </section>
  );
}

export default TaskDetails;
