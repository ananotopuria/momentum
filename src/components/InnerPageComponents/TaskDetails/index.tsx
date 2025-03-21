import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Select from "react-select";
import { motion } from "framer-motion";
import { Task } from "../../../hooks/useTasks";
import { useStatuses } from "../../../hooks/useStatuses";
import { LuChartPie } from "react-icons/lu";
import { GoPerson } from "react-icons/go";
import { FiCalendar } from "react-icons/fi";
import FormattedDate from "./../../CommonComponents/FormattedDate";
import { IoIosArrowDown } from "react-icons/io";
import { useDepartments } from "./../../../hooks/useDepartments";
const VITE_AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

const fetchTaskById = async (id: string): Promise<Task> => {
  const response = await axios.get(
    `https://momentum.redberryinternship.ge/api/tasks/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VITE_AUTH_TOKEN}`,
      },
    }
  );
  return response.data;
};

function TaskDetails() {
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: statuses = [] } = useStatuses();

  const {
    data: task,
    isLoading,
    error,
  } = useQuery<Task>({
    queryKey: ["task", id],
    queryFn: () => fetchTaskById(id!),
    enabled: !!id,
  });
  const { data: departments = [] } = useDepartments();
  const [selectedStatus, setSelectedStatus] = useState<number | undefined>();
  
  useEffect(() => {
    if (task && selectedStatus === undefined) {
      setSelectedStatus(task.status.id);
    }
  }, [task, selectedStatus]);
  
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatusId: number) => {
      await axios.put(
        `https://momentum.redberryinternship.ge/api/tasks/${id}`,
        { status_id: newStatusId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${VITE_AUTH_TOKEN}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
  });
  const departmentColor =
  departments.find((dept) => dept.id === task?.department?.id)?.color || "#CCCCCC";

  if (isLoading) return <p>Loading task details...</p>;
  if (error) return <p>Error loading task details</p>;
  
  const statusOptions = statuses.map((status) => ({
    value: status.id,
    label: status.name,
  }));

  return (
    <section className="w-[71.5rem] mt-[4rem]">
      <div className="w-full flex items-center gap-8">
        <div
          className={`
            flex items-center px-[0.4rem] py-[0.2rem] border rounded-sm text-[1.6rem] font-[500] leading-[1.5]
            ${
              task?.priority?.name === "მაღალი"
                ? "text-red border-red"
                : task?.priority?.name === "საშუალო"
                ? "text-yellow border-yellow"
                : task?.priority?.name === "დაბალი"
                ? "text-green border-green"
                : "text-grey border-grey"
            }
          `}
        >
          <img
            src={task?.priority?.icon || "/default-priority-icon.png"}
            alt="Priority"
            className="w-8 h-8 mr-1"
          />
          <div>{task?.priority?.name || "პრიორიტეტი ვერ მოიძებნა"}</div>
        </div>

        <div className="text-[1.6rem] font-normal leading-[1]  px-[1.5rem] py-[0.8rem] rounded-3xl" style={{ backgroundColor: departmentColor, color: "white" }}>
          {task?.department?.name || "დავალება ვერ მოიძებნა"}
        </div>
      </div>

      <h1 className="text-[3.4rem] font-semibold leading-[1] tracking-[0] mt-[1.2rem] text-gray-700">
        {task?.name || "დავალება"}
      </h1>

      <p className="mt-[2.6rem] text-[1.8rem] font-normal leading-[1.5] tracking-[0] text-black">
        {task?.description || "აღწერა არ არის"}
      </p>

      <div className="mt-[6.3rem]">
        <h2 className="text-[2.4rem] font-medium leading-[1] text-grey">
          დავალების დეტალები
        </h2>
        <div className="w-[50rem] mt-[2.8rem]">
          <div className="flex justify-between">
            <div className="flex gap-2 justify-center items-center">
              <LuChartPie className="text-[1.6rem]" />
              <h3 className="text-darkerGrey text-[1.6rem] leading-[1.5] font-normal">
                სტატუსი
              </h3>
            </div>
            <div className="relative w-[26rem]">
              <Select
                options={statusOptions}
                value={
                  statusOptions.find(
                    (option) => option.value === selectedStatus
                  ) || null
                }
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    setSelectedStatus(selectedOption.value);
                    updateStatusMutation.mutate(selectedOption.value);
                  }
                }}
                onMenuOpen={() => setIsOpen(true)} 
                onMenuClose={() => setIsOpen(false)} 
                isDisabled={updateStatusMutation.status === "pending"}
                className="w-full mt-1"
                classNamePrefix="react-select"
                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "lighterGrey",
                    boxShadow: "none",
                    "&:hover": { borderColor: "blueViolet" },
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "white",
                    zIndex: 100,
                  }),
                  option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected
                      ? "blueViolet"
                      : isFocused
                      ? "lavender"
                      : "white",
                    color: isSelected ? "white" : "black",
                  }),
                }}
              />
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: isOpen ? 180 : 0 }} 
                transition={{ duration: 0.3 }}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none"
              >
                <IoIosArrowDown />
              </motion.div>
            </div>
          </div>
          <div className="flex mt-[4.6rem] gap-[10rem]">
            <div className="flex gap-2 justify-center items-center">
              <GoPerson className="text-[1.6rem]" />
              <h3 className="text-darkerGrey text-[1.6rem] leading-[1.5] font-normal">
                თანამშრომელი
              </h3>
            </div>
            <div className="flex gap-[1rem]">
              <img
                className="w-[3.2rem] h-[3.2rem] rounded-full"
                src={task?.employee?.avatar}
                alt="employee avatar"
              />
              <div className="flex flex-col">
                <div className="text-darkerGrey text-[1.1rem] leading-[1] font-light">
                  {task?.department?.name}
                </div>
                <div className="text-#0D0F10 text-[1.4rem] leading-[1.5] font-normal">
                  {task?.employee?.name} {task?.employee?.surname}
                </div>
              </div>
            </div>
          </div>
          <div className="flex mt-[4.6rem] gap-[10rem]">
            <div className="flex gap-2 justify-center items-center">
              <FiCalendar className="text-[1.6rem]" />
              <h3 className="text-darkerGrey text-[1.6rem] leading-[1.5] font-normal">
                დავალების ვადა
              </h3>
            </div>
            <div className="text-#0D0F10 text-[1.4rem] leading-[1.5] font-normal">
              <FormattedDate date={task?.due_date} formatType="weekday" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TaskDetails;
