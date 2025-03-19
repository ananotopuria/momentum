import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import { useEmployees } from "../../../hooks/useEmployees";
import { usePriorities } from "../../../hooks/usePriorities";
import { useDepartments } from "../../../hooks/useDepartments";
import { FiltersProps } from "../types";

function Filters({ filters, setFilters }: FiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [tempDepartments, setTempDepartments] = useState<string[]>(
    filters.departments
  );
  const [tempPriorities, setTempPriorities] = useState<string[]>(
    filters.priorities
  );
  const [tempAssignee, setTempAssignee] = useState<string[]>(
    Array.isArray(filters.assignee) ? filters.assignee : []
  );

  const {
    data: employees = [],
    isLoading: isLoadingEmployees,
    isError: isErrorEmployees,
  } = useEmployees();
  const {
    data: priorities,
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

  const toggleDropdown = (dropdown: string) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdown);
      if (dropdown === "departments") {
        setTempDepartments(filters.departments);
      } else if (dropdown === "priorities") {
        setTempPriorities(filters.priorities);
      } else if (dropdown === "assignee") {
        setTempAssignee(
          Array.isArray(filters.assignee) ? filters.assignee : []
        );
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      departments: [],
      priorities: [],
      assignee: [],
    });
  };

  const removeFilter = (
    type: "departments" | "priorities" | "assignee",
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].filter((item: string) => item !== value),
    }));
  };

  return (
    <div>
      <div
        className="bg-white rounded-xl border border-gainsboro p-[1.2rem] relative w-[68.8rem] text-blackish text-[1.6rem]"
        ref={dropdownRef}
      >
        <div className="flex justify-between">
          {["departments", "priorities", "assignee"].map((filter) => (
            <h3
              key={filter}
              className="text-[1.6rem] leading-[1] font-normal cursor-pointer flex justify-between items-center"
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
              className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-300 shadow-md rounded-xl p-4 z-10 w-full"
            >
              {openDropdown === "departments" && (
                <div>
                  {isLoadingDepartments ? (
                    <p>Loading departments...</p>
                  ) : isErrorDepartments ? (
                    <p className="text-red-500">Failed to load departments</p>
                  ) : departments.length > 0 ? (
                    <>
                      {departments.map((dept) => (
                        <label
                          key={dept.id}
                          className="block p-[1rem] text-[1.6rem] font-normal leading-[1]"
                        >
                          <input
                            type="checkbox"
                            checked={tempDepartments.includes(dept.name)}
                            onChange={() =>
                              tempDepartments.includes(dept.name)
                                ? setTempDepartments(
                                    tempDepartments.filter(
                                      (v) => v !== dept.name
                                    )
                                  )
                                : setTempDepartments([
                                    ...tempDepartments,
                                    dept.name,
                                  ])
                            }
                          />{" "}
                          {dept.name}
                        </label>
                      ))}
                      <div className="flex justify-end">
                        <button
                          className="mt-[2.5rem] bg-blueViolet hover:bg-brightLavender text-white px-[4.5rem] py-[0.8rem] rounded-3xl text-[1.6rem] font-normal leading-[1] transition-colors duration-300"
                          onClick={() => {
                            setFilters((prev) => ({
                              ...prev,
                              departments: tempDepartments,
                            }));
                            setOpenDropdown(null);
                          }}
                        >
                          არჩევა
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500">დეპარტამენტი არ მოიძებნა</p>
                  )}
                </div>
              )}

              {openDropdown === "priorities" && (
                <div>
                  {isLoadingPriorities ? (
                    <p>Loading priorities...</p>
                  ) : isErrorPriorities ? (
                    <p className="text-red-500">Failed to load priorities</p>
                  ) : priorities && priorities.length > 0 ? (
                    <>
                      {priorities.map((priority) => (
                        <label
                          key={priority.id}
                          className="block p-[1rem] text-[1.6rem] font-normal leading-[1]"
                        >
                          <input
                            type="checkbox"
                            checked={tempPriorities.includes(priority.name)}
                            onChange={() =>
                              tempPriorities.includes(priority.name)
                                ? setTempPriorities(
                                    tempPriorities.filter(
                                      (v) => v !== priority.name
                                    )
                                  )
                                : setTempPriorities([
                                    ...tempPriorities,
                                    priority.name,
                                  ])
                            }
                          />{" "}
                          {priority.name}
                        </label>
                      ))}
                      <div className="flex justify-end">
                        <button
                          className="mt-[2.5rem] bg-blueViolet hover:bg-brightLavender text-white px-[4.5rem] py-[0.8rem] rounded-3xl text-[1.6rem] font-normal leading-[1] transition-colors duration-300"
                          onClick={() => {
                            setFilters((prev) => ({
                              ...prev,
                              priorities: tempPriorities,
                            }));
                            setOpenDropdown(null);
                          }}
                        >
                          არჩევა
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500">პრიორიტეტი ვერ მოიძებნა</p>
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
                    <>
                      {employees.map((employee) => {
                        const fullName = `${employee.name} ${employee.surname}`;
                        return (
                          <label
                            key={employee.id}
                            className="block p-[1rem] text-[1.6rem] font-normal leading-[1]"
                          >
                            <input
                              type="checkbox"
                              checked={tempAssignee.includes(fullName)}
                              onChange={() =>
                                tempAssignee.includes(fullName)
                                  ? setTempAssignee(
                                      tempAssignee.filter((v) => v !== fullName)
                                    )
                                  : setTempAssignee([...tempAssignee, fullName])
                              }
                            />{" "}
                            {fullName}
                          </label>
                        );
                      })}
                      <div className="flex justify-end">
                        <button
                          className="mt-[2.5rem] bg-blueViolet hover:bg-brightLavender text-white px-[4.5rem] py-[0.8rem] rounded-3xl text-[1.6rem] font-normal leading-[1] transition-colors duration-300"
                          onClick={() => {
                            setFilters((prev) => ({
                              ...prev,
                              assignee: tempAssignee,
                            }));
                            setOpenDropdown(null);
                          }}
                        >
                          არჩევა
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500">
                      თანამშრომელი არ არის დამატებული
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          {filters.departments.map((dept, idx) => (
            <div
              key={`dept-${idx}`}
              className="flex items-center bg-white border border-gray-300 text-grey rounded-full px-3 py-1 text-[1.4rem]"
            >
              {dept}
              <button
                onClick={() => removeFilter("departments", dept)}
                className="ml-2 text-red-500"
              >
                x
              </button>
            </div>
          ))}
          {filters.priorities.map((priority, idx) => (
            <div
              key={`priority-${idx}`}
              className="flex items-center bg-white border border-gray-300 text-grey rounded-full px-3 py-1 text-[1.4rem]"
            >
              {priority}
              <button
                onClick={() => removeFilter("priorities", priority)}
                className="ml-2 text-red-500"
              >
                x
              </button>
            </div>
          ))}
          {Array.isArray(filters.assignee) &&
            filters.assignee.map((assignee, idx) => (
              <div
                key={`assignee-${idx}`}
                className="flex items-center bg-white border border-gray-300 text-grey rounded-full px-3 py-1 text-[1.4rem]"
              >
                {assignee}
                <button
                  onClick={() => removeFilter("assignee", assignee)}
                  className="ml-2 text-red-500"
                >
                  x
                </button>
              </div>
            ))}
          {(filters.departments.length > 0 ||
            filters.priorities.length > 0 ||
            (Array.isArray(filters.assignee) &&
              filters.assignee.length > 0)) && (
            <button
              onClick={clearFilters}
              className="bg-red-500 text-darkGrey px-3 py-1 rounded text-[1.4rem]"
            >
              გასუფთავება
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Filters;
