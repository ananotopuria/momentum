import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

const fetchTasks = async (): Promise<Task[]> => {
  const response = await axios.get("https://momentum.redberryinternship.ge/api/tasks", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer 9e69afcb-2aa2-4cb2-9841-a898e8708a26`,
    },
  });
  return response.data;
};

export function useTasks() {
  return useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
}
