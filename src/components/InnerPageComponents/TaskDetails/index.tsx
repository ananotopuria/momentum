import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useStatuses } from "../../../hooks/useStatuses";

export interface Task {
  id: number;
  name: string;
  description: string;
  due_date: string;
  department: {
    id: number;
    name: string;
  };
  employee: {
    id: number;
    name: string;
    surname: string;
    avatar: string;
    department: {
      id: number;
      name: string;
    };
  };
  status: {
    id: number;
    name: string;
  };
  priority: {
    id: number;
    name: string;
    icon: string;
  };
  total_comments: number;
}

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

  const {
    data: statuses = [],
    isLoading: isLoadingStatuses,
    isError: isErrorStatuses,
  } = useStatuses();

  const {
    data: task,
    isLoading: isLoadingTask,
    isError: isErrorTask,
  } = useQuery<Task, Error>({
    queryKey: ["task", id],
    queryFn: () => fetchTaskById(id!),
    enabled: !!id,
  });

  const [selectedStatus, setSelectedStatus] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (task && selectedStatus === undefined) {
      setSelectedStatus(task.status.id);
    }
  }, [task, selectedStatus]);

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatusId: number) => {
      const response = await axios.put(
        `https://momentum.redberryinternship.ge/api/tasks/${id}`,
        { status_id: newStatusId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 9e69afcb-2aa2-4cb2-9841-a898e8708a26`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
  });

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = Number(e.target.value);
    setSelectedStatus(newStatus);
    if (task && newStatus !== task.status.id) {
      updateStatusMutation.mutate(newStatus);
    }
  };

  if (isLoadingTask || isLoadingStatuses) return <p>Loading task details...</p>;
  if (isErrorTask || !task || isErrorStatuses)
    return <p>Failed to load task details.</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{task.name}</h1>
      <p className="mb-4">{task.description}</p>
      <p className="mb-2">{new Date(task.due_date).toLocaleDateString()}</p>
      <p className="mb-2">{task.priority.name}</p>
      <div className="flex items-center mb-4">
        <img
          src={task.employee.avatar}
          alt={`${task.employee.name} ${task.employee.surname}`}
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <p>
            {task.employee.name} {task.employee.surname}
          </p>
          <p>
            <strong>Department:</strong> {task.employee.department.name}
          </p>
        </div>
      </div>
      <div className="mb-8">
        <label className="block text-lg font-medium mb-2">Status</label>
        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="border p-2 rounded w-full"
        >
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>
        {updateStatusMutation.status === "error" && (
          <p className="text-red-500 mt-2">Failed to update status.</p>
        )}
      </div>
    </div>
  );
}

export default TaskDetails;
