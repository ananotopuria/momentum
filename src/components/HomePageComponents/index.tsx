import { useState } from "react";
import Title from "../CommonComponents/Title";
import Filters from "./Filter";

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
    <>
      <Title text="დავალების გვერდი" />
      <section className="px-[12rem]">
        <Filters filters={filters} setFilters={setFilters} />
      </section>
    </>
  );
}

export default HomePageComponents;
