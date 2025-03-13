import { useEffect, useState } from "react";

interface Status {
  id: number;
  name: string;
}

const statusColors: string[] = ["#F7BC30", "#FB5607", "#FF006E", "#3A86FF"];

function StatusBoard() {
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    async function fetchStatuses() {
      try {
        const response = await fetch(
          "https://momentum.redberryinternship.ge/api/statuses"
        );
        const data: Status[] = await response.json();
        setStatuses(data);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    }

    fetchStatuses();
  }, []);

  return (
    <section className="flex justify-between p-[12rem]">
      {statuses.map((status, index) => (
        <div
          key={status.id}
          className="w-[38rem] py-[1.5rem] rounded-xl text-white text-center"
          style={{ backgroundColor: statusColors[index] }}
        >
          <h2 className="text-[1.8rem] font-[500]">{status.name}</h2>
        </div>
      ))}
    </section>
  );
}

export default StatusBoard;
