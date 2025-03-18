import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// interface Employee {
//   id: number;
//   name: string;
//   surname: string;
//   // department_id: number;
// }

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
      Authorization: `Bearer 9e69afcb-2aa2-4cb2-9841-a898e8708a26`,
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
