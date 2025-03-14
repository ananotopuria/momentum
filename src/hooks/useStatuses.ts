import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Status {
  id: number;
  name: string;
}

const fetchStatuses = async (): Promise<Status[]> => {
  const response = await axios.get("https://momentum.redberryinternship.ge/api/statuses");
  return response.data;
};

export function useStatuses() {
  return useQuery<Status[], Error>({
    queryKey: ["statuses"],
    queryFn: fetchStatuses,
  });
}
