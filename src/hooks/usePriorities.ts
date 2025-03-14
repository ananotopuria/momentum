import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Priority {
  id: number;
  name: string;
  icon: string;
}

const fetchPriorities = async (): Promise<Priority[]> => {
  const response = await axios.get("https://momentum.redberryinternship.ge/api/priorities");
  return response.data;
};

export function usePriorities() {
  return useQuery<Priority[], Error>({
    queryKey: ["priorities"],
    queryFn: fetchPriorities,
  });
}
