import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Department {
  id: number;
  name: string;
  color?: string;
}

const colors = [
  "#FF66A8",
  "#FD9A6A",
  "#FD9A6A",
  "#FFD86D",
  "#A8E6CF",
  "#66B3FF",
  "#C9A7EB",
];

const fetchDepartments = async (): Promise<Department[]> => {
  const response = await axios.get(
    "https://momentum.redberryinternship.ge/api/departments"
  );
  return response.data.map((department: Department, index: number) => ({
    ...department,
    color: colors[index % colors.length],
  }));
};

export function useDepartments() {
  return useQuery<Department[], Error>({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });
}
