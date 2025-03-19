import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Title from "../CommonComponents/Title";
import Filters from "./Filter";
import StatusTasksBoard from "./StatusTaskBoard";

function HomePageComponents() {
  const location = useLocation();
  const defaultFilters = { departments: [], priorities: [], assignee: "" };

  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem("taskFilters");
    return savedFilters ? JSON.parse(savedFilters) : defaultFilters;
  });

  useEffect(() => {
    return () => {
      localStorage.removeItem("taskFilters");
    };
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem("taskFilters", JSON.stringify(filters));
  }, [filters]);

  return (
    <main>
      <div className="pt-[10rem]">
        <Title text="დავალების გვერდი" />
      </div>
      <section className="px-[12rem]">
        <Filters filters={filters} setFilters={setFilters} />
      </section>
      <StatusTasksBoard filters={filters} setFilters={setFilters} />
    </main>
  );
}

export default HomePageComponents;
