import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Department {
  id: number;
  name: string;
}

const fetchDepartments = async (): Promise<Department[]> => {
  const response = await axios.get("https://momentum.redberryinternship.ge/api/departments");
  return response.data;
};

export function useDepartments() {
  return useQuery<Department[], Error>({
    queryKey: ["departments"], 
    queryFn: fetchDepartments,
  });
}
