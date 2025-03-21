import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const VITE_AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

interface Employee {
  id: number;
  name: string;
  surname: string;
  avatar?: string;
  department_id?: number;
  department?: {
    id: number;
    name: string;
  };
}

const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await axios.get("https://momentum.redberryinternship.ge/api/employees", {
    headers: {
      Authorization: `Bearer ${VITE_AUTH_TOKEN}`,
    },
  });
  return response.data;
};

export function useEmployees() {
  return useQuery<Employee[], Error>({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });
}
