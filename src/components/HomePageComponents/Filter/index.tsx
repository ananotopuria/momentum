import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import { useEmployees } from "../../../hooks/useEmployees";
import { usePriorities } from "../../../hooks/usePriorities";
import { useDepartments } from "../../../hooks/useDepartments";

interface FiltersProps {
  filters: {
    departments: string[];
    priorities: string[];
    assignee: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      departments: string[];
      priorities: string[];
      assignee: string;
    }>
  >;
}

function Filters({ filters, setFilters }: FiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    data: employees = [],
    isLoading: isLoadingEmployees,
    isError: isErrorEmployees,
  } = useEmployees();
  const {
    data: priorities = [],
    isLoading: isLoadingPriorities,
    isError: isErrorPriorities,
  } = usePriorities();
  const {
    data: departments = [],
    isLoading: isLoadingDepartments,
    isError: isErrorDepartments,
  } = useDepartments();

  useEffect(() => {
    localStorage.setItem("taskFilters", JSON.stringify(filters));
  }, [filters]);

  const handleMultiSelectChange = (
    key: "departments" | "priorities",
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const handleAssigneeChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      assignee: value,
    }));
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="bg-white rounded border border-gray-300 p-4 relative w-[68.8rem]"
      ref={dropdownRef}
    >
      <div className="flex justify-between">
        {["departments", "priorities", "assignee"].map((filter) => (
          <h3
            key={filter}
            className="text-[1.6rem] font-normal cursor-pointer flex justify-between items-center"
            onClick={() => toggleDropdown(filter)}
          >
            {filter === "departments"
              ? "დეპარტამენტები"
              : filter === "priorities"
              ? "პრიორიტეტი"
              : "თანამშრომელი"}
            <motion.span
              animate={{ rotate: openDropdown === filter ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <IoIosArrowDown />
            </motion.span>
          </h3>
        ))}
      </div>

      <AnimatePresence>
        {openDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-300 shadow-md rounded p-4 z-10 w-full"
          >
            {openDropdown === "departments" && (
              <div>
                {isLoadingDepartments ? (
                  <p>Loading departments...</p>
                ) : isErrorDepartments ? (
                  <p className="text-red-500">Failed to load departments</p>
                ) : departments.length > 0 ? (
                  departments.map((dept) => (
                    <label key={dept.id} className="block">
                      <input
                        type="checkbox"
                        checked={filters.departments.includes(dept.name)}
                        onChange={() =>
                          handleMultiSelectChange("departments", dept.name)
                        }
                      />{" "}
                      {dept.name}
                    </label>
                  ))
                ) : (
                  <p className="text-gray-500">No departments available</p>
                )}
              </div>
            )}

            {openDropdown === "priorities" && (
              <div>
                {isLoadingPriorities ? (
                  <p>Loading priorities...</p>
                ) : isErrorPriorities ? (
                  <p className="text-red-500">Failed to load priorities</p>
                ) : priorities.length > 0 ? (
                  priorities.map((priority) => (
                    <label key={priority.id} className="block">
                      <input
                        type="checkbox"
                        checked={filters.priorities.includes(priority.name)}
                        onChange={() =>
                          handleMultiSelectChange("priorities", priority.name)
                        }
                      />{" "}
                      {priority.name}
                    </label>
                  ))
                ) : (
                  <p className="text-gray-500">No priorities available</p>
                )}
              </div>
            )}

            {openDropdown === "assignee" && (
              <div>
                {isLoadingEmployees ? (
                  <p>Loading employees...</p>
                ) : isErrorEmployees ? (
                  <p className="text-red-500">Failed to load employees</p>
                ) : employees.length > 0 ? (
                  <select
                    className="border p-2 rounded w-full"
                    onChange={(e) => handleAssigneeChange(e.target.value)}
                    value={filters.assignee}
                  >
                    <option value="">აირჩიეთ თანამშრომელი</option>
                    {employees.map((employee) => (
                      <option
                        key={employee.id}
                        value={`${employee.name} ${employee.surname}`}
                      >
                        {employee.name} {employee.surname}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-500">No employees available</p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Filters;
