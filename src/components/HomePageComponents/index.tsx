import { useState } from "react";
import Title from "../CommonComponents/Title";
import Filters from "./Filter";
import StatusBoard from "./StatusBoard";
import TasksList from "./TasksList";

function HomePageComponents() {
  const [filters, setFilters] = useState<{
    departments: string[];
    priorities: string[];
    assignee: string;
  }>({
    departments: [],
    priorities: [],
    assignee: "",
  });

  return (
    <main>
      <Title text="დავალების გვერდი" />
      <section className="px-[12rem]">
        <Filters filters={filters} setFilters={setFilters} />
      </section>
      <StatusBoard />
      <TasksList />
    </main>
  );
}

export default HomePageComponents;
