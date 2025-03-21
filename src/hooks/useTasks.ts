import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const VITE_AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

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
  console.log(VITE_AUTH_TOKEN)
  const response = await axios.get(
    "https://momentum.redberryinternship.ge/api/tasks",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VITE_AUTH_TOKEN}`,
      },
    }
  );
  return response.data;
};

export function useTasks() {
  return useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
}
