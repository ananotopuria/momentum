import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";

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

  const departmentOptions = [
    "მარკეტინგის დეპარტამენტი",
    "დიზაინის დეპარტამენტი",
    "ლოჯისტიკის დეპარტამენტი",
    "IT დეპარტამენტი",
  ];
  const priorityOptions = ["დაბალი", "საშუალო", "მაღალი"];
  const assigneeOptions = ["dfsfsf", "dsfdsfdsf", "dfsfsfs", "fsfsfsdxczc"];

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
      className="bg-white rounded border border-gainsboro p-4 relative w-[68.8rem]"
      ref={dropdownRef}
    >
      <div className="flex justify-between">
        <h3
          className="text-[1.6rem] font-normal cursor-pointer flex justify-between items-center"
          onClick={() => toggleDropdown("departments")}
        >
          დეპარტამენტები
          <motion.span
            animate={{ rotate: openDropdown === "departments" ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoIosArrowDown />
          </motion.span>
        </h3>

        <h3
          className="text-[1.6rem] font-normal cursor-pointer flex justify-between items-center"
          onClick={() => toggleDropdown("priorities")}
        >
          პრიორიტეტი
          <motion.span
            animate={{ rotate: openDropdown === "priorities" ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoIosArrowDown />
          </motion.span>
        </h3>

        <h3
          className="text-[1.6rem] font-normal cursor-pointer flex justify-between items-center"
          onClick={() => toggleDropdown("assignee")}
        >
          თანამშრომელი
          <motion.span
            animate={{ rotate: openDropdown === "assignee" ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoIosArrowDown />
          </motion.span>
        </h3>
      </div>

      <AnimatePresence>
        {openDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-300 shadow-md rounded p-4 z-10 w-full"
          >
            {openDropdown === "departments" &&
              departmentOptions.map((dept) => (
                <label key={dept} className="block">
                  <input
                    type="checkbox"
                    checked={filters.departments.includes(dept)}
                    onChange={() =>
                      handleMultiSelectChange("departments", dept)
                    }
                  />{" "}
                  {dept}
                </label>
              ))}
            {openDropdown === "priorities" &&
              priorityOptions.map((priority) => (
                <label key={priority} className="block">
                  <input
                    type="checkbox"
                    checked={filters.priorities.includes(priority)}
                    onChange={() =>
                      handleMultiSelectChange("priorities", priority)
                    }
                  />{" "}
                  {priority}
                </label>
              ))}

            {openDropdown === "assignee" && (
              <select
                className="border p-2 rounded w-full"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, assignee: e.target.value }))
                }
                value={filters.assignee}
              >
                <option value="">აირჩიეთ</option>
                {assigneeOptions.map((assignee) => (
                  <option key={assignee} value={assignee}>
                    {assignee}
                  </option>
                ))}
              </select>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Filters;
