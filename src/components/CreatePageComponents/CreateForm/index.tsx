import { useEffect, useState } from "react";
import {
  useForm,
  FieldError,
  SubmitHandler,
  Controller,
} from "react-hook-form";
import Button from "../../CommonComponents/Button";
import { useDepartments } from "./../../../hooks/useDepartments";
import { useEmployees } from "../../../hooks/useEmployees";
import { useStatuses } from "../../../hooks/useStatuses";
import { usePriorities } from "../../../hooks/usePriorities";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { motion } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import { OptionType, FormData } from "../types";

const customSelectStyles: StylesConfig<OptionType, false> = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? "blueviolet" : "lightgrey",
    boxShadow: "none",
    "&:hover": { borderColor: "blueviolet" },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "white",
    zIndex: 100,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "blueviolet"
      : state.isFocused
      ? "lavender"
      : "white",
    color: state.isSelected ? "white" : "black",
  }),
};

function CreateForm() {
  const navigate = useNavigate();
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .split("T")[0];
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, touchedFields },
    reset,
    setValue,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      due_date: tomorrow,
    },
  });

  const titleValue = watch("title", "");
  const descriptionValue = watch("description", "") || "";
  const departmentValue = watch("department_id", "");
  const dueDateValue = watch("due_date", tomorrow);

  const {
    data: departments = [],
    isLoading: isLoadingDepartments,
    isError: isErrorDepartments,
  } = useDepartments();
  const {
    data: employees = [],
    isLoading: isLoadingEmployees,
    isError: isErrorEmployees,
  } = useEmployees();
  const {
    data: statuses = [],
    isLoading: isLoadingStatuses,
    isError: isErrorStatuses,
  } = useStatuses();
  const {
    data: priorities = [],
    isLoading: isLoadingPriorities,
    isError: isErrorPriorities,
  } = usePriorities();

  const filteredEmployees = employees.filter((emp) => {
    const deptId =
      emp.department_id !== undefined ? emp.department_id : emp.department?.id;
    return deptId?.toString() === departmentValue;
  });

  const getInputBorderColor = (value: string, error?: FieldError) => {
    if (value.length === 0) return "border-lightGrey";
    if (error) return "border-red";
    return "border-green";
  };

  const isMinLengthValid = (value: string, min: number) => value.length >= min;
  const isMaxLengthValid = (value: string, max: number) => value.length <= max;

  useEffect(() => {
    setValue("responsible_employee_id", "");
  }, [departmentValue, setValue]);

  const getValidationClass = (
    fieldName: keyof FormData,
    validationFn: () => boolean,
    errorExists: boolean
  ) => {
    return !touchedFields[fieldName]
      ? "text-lightGrey"
      : errorExists
      ? "text-red"
      : validationFn()
      ? "text-green"
      : "text-red";
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!isValid) return;

    const taskData = {
      name: data.title,
      description: data.description,
      due_date: new Date(data.due_date).toISOString(),
      department_id: Number(data.department_id),
      employee_id: Number(data.responsible_employee_id),
      status_id: Number(data.status_id),
      priority_id: Number(data.priority_id),
    };
    try {
      const response = await axios.post(
        "https://momentum.redberryinternship.ge/api/tasks",
        taskData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 9e69afcb-2aa2-4cb2-9841-a898e8708a26`,
          },
        }
      );
      if (response.status === 201) {
        reset();
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.log("Response Data:", error.response.data);
      }
    }
  };

  const departmentOptions = departments.map((dept) => ({
    value: dept.id.toString(),
    label: dept.name,
  }));
  const employeeOptions = filteredEmployees.map((emp) => ({
    value: emp.id.toString(),
    label: `${emp.name} ${emp.surname}`,
  }));
  const priorityOptions = priorities.map((priority) => ({
    value: priority.id.toString(),
    label: priority.name,
  }));
  const statusOptions = statuses.map((status) => ({
    value: status.id.toString(),
    label: status.name,
  }));

  const [isOpenDept, setIsOpenDept] = useState(false);
  const [isOpenEmployee, setIsOpenEmployee] = useState(false);
  const [isOpenPriority, setIsOpenPriority] = useState(false);
  const [isOpenStatus, setIsOpenStatus] = useState(false);

  return (
    <section className="">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-[5.5rem] py-[5.5rem] bg-[#FBF9FFA6] border border-lavender rounded-sm mx-[11.8rem]"
      >
        <div className="flex">
          <div className="">
            <label className="block text-[1.6rem] text-darkGrey font-normal leading-[1]">
              სათაური*
            </label>
            <input
              {...register("title", {
                required: "სავალდებულოა",
                minLength: { value: 3, message: "მინიმუმ 3 სიმბოლო" },
                maxLength: { value: 255, message: "მაქსიმუმ 255 სიმბოლო" },
              })}
              className={`w-[55rem] h-[4.5rem] border p-[1.4rem] rounded-md mt-[1rem] ${getInputBorderColor(
                titleValue,
                errors.title
              )}`}
            />
            <p
              className={`text-[1.2rem] mt-1 ${getValidationClass(
                "title",
                () => isMinLengthValid(titleValue, 3),
                !!errors.title
              )}`}
            >
              &#x2713; მინიმუმ 3 სიმბოლო
            </p>
            <p
              className={`text-[1.2rem] ${getValidationClass(
                "title",
                () => isMaxLengthValid(titleValue, 255),
                !!errors.title
              )}`}
            >
              &#x2713; მაქსიმუმ 255 სიმბოლო
            </p>
          </div>
          <div className="ml-[16.1rem]">
            <label className="block text-[1.6rem] text-darkGrey font-normal leading-[1]">
              დეპარტამენტი*
            </label>
            {isLoadingDepartments ? (
              <p className="text-grey">Loading departments...</p>
            ) : isErrorDepartments ? (
              <p className="text-red">Failed to load departments</p>
            ) : (
              <Controller
                name="department_id"
                control={control}
                rules={{ required: "დეპარტამენტი სავალდებულოა" }}
                render={({ field, fieldState }) => {
                  const selectedOption =
                    departmentOptions.find(
                      (option) => option.value === field.value
                    ) || null;
                  return (
                    <div className="relative">
                      <Select
                        options={departmentOptions}
                        value={selectedOption}
                        onChange={(selectedOption) =>
                          field.onChange(
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                        onMenuOpen={() => setIsOpenDept(true)}
                        onMenuClose={() => setIsOpenDept(false)}
                        isDisabled={false}
                        placeholder="აირჩიეთ დეპარტამენტი"
                        className="w-[55rem] rounded-md mt-[1rem] "
                        classNamePrefix="react-select"
                        components={{
                          DropdownIndicator: () => null,
                          IndicatorSeparator: () => null,
                        }}
                        styles={customSelectStyles}
                      />
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: isOpenDept ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-1/3 right-5 transform -translate-y-1/2 pointer-events-none"
                      >
                        <IoIosArrowDown />
                      </motion.div>
                      {fieldState.error && (
                        <p className="text-red text-[1.2rem] mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  );
                }}
              />
            )}
          </div>
        </div>
        <div className="mt-[5.5rem] flex">
          <div className="">
            <label className="block text-[1.6rem] text-darkGrey font-normal leading-[1]">
              აღწერა
            </label>
            <textarea
              {...register("description", {
                validate: (value) => {
                  if (value && value.trim() !== "") {
                    if (value.split(" ").length < 4) {
                      return "მინიმუმ 4 სიტყვა";
                    }
                    if (value.length > 255) {
                      return "მაქსიმუმ 255 სიმბოლო";
                    }
                  }
                  return true;
                },
              })}
              className={`w-[55rem] h-[13.1rem] mt-[1rem] border p-2 rounded-lg ${getInputBorderColor(
                descriptionValue,
                errors.description
              )}`}
              placeholder="გთხოვთ დაწეროთ აღწერა..."
            />
            <p
              className={`text-[1.2rem] mt-1 ${
                errors.description
                  ? "text-red"
                  : descriptionValue.split(" ").length >= 4
                  ? "text-green"
                  : "text-lightGrey"
              }`}
            >
              &#x2713; მინიმუმ 4 სიტყვა
            </p>
            <p
              className={`text-[1.2rem] ${
                errors.description
                  ? "text-red"
                  : descriptionValue.length > 255
                  ? "text-red"
                  : descriptionValue.split(" ").length >= 4
                  ? "text-green"
                  : "text-lightGrey"
              }`}
            >
              &#x2713; მაქსიმუმ 255 სიმბოლო
            </p>
          </div>
          <div>
            {departmentValue && (
              <div className="ml-[16.1rem]">
                <label className="block text-[1.6rem] text-darkGrey font-normal leading-[1]">
                  პასუხისმგებელი თანამშრომელი*
                </label>
                {isLoadingEmployees ? (
                  <p className="text-grey">Loading employees...</p>
                ) : isErrorEmployees ? (
                  <p className="text-red">Failed to load employees</p>
                ) : (
                  <Controller
                    name="responsible_employee_id"
                    control={control}
                    rules={{
                      required: "პასუხისმგებელი თანამშრომელი სავალდებულოა",
                    }}
                    render={({ field, fieldState }) => {
                      const selectedOption =
                        employeeOptions.find(
                          (option) => option.value === field.value
                        ) || null;
                      return (
                        <div className="relative">
                          <Select
                            options={employeeOptions}
                            value={selectedOption}
                            onChange={(selectedOption) =>
                              field.onChange(
                                selectedOption ? selectedOption.value : ""
                              )
                            }
                            onMenuOpen={() => setIsOpenEmployee(true)}
                            onMenuClose={() => setIsOpenEmployee(false)}
                            isDisabled={employeeOptions.length === 0}
                            placeholder={
                              employeeOptions.length === 0
                                ? "ამ დეპარტამენტში თანამშრომელი არ იძებნება"
                                : "აირჩიეთ თანამშრომელი"
                            }
                            className="w-[55rem] mt-[1rem]"
                            classNamePrefix="react-select"
                            components={{
                              DropdownIndicator: () => null,
                              IndicatorSeparator: () => null,
                            }}
                            styles={customSelectStyles}
                          />
                          <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: isOpenEmployee ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none"
                          >
                            <IoIosArrowDown />
                          </motion.div>
                          {fieldState.error && (
                            <p className="text-red text-[1.2rem] mt-1">
                              {fieldState.error.message}
                            </p>
                          )}
                        </div>
                      );
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex mt-[5.5rem]">
          <div className="flex w-[55rem] justify-between">
            <div className="">
              <label className="block text-[1.6rem] text-darkGrey font-normal leading-[1]">
                პრიორიტეტი*
              </label>
              {isLoadingPriorities ? (
                <p className="text-grey">Loading priorities...</p>
              ) : isErrorPriorities ? (
                <p className="text-red">Failed to load priorities</p>
              ) : (
                <Controller
                  name="priority_id"
                  control={control}
                  rules={{ required: "პრიორიტეტი სავალდებულოა" }}
                  render={({ field, fieldState }) => {
                    const selectedOption =
                      priorityOptions.find(
                        (option) => option.value === field.value
                      ) || null;
                    return (
                      <div className="relative">
                        <Select
                          options={priorityOptions}
                          value={selectedOption}
                          onChange={(selectedOption) =>
                            field.onChange(
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          onMenuOpen={() => setIsOpenPriority(true)}
                          onMenuClose={() => setIsOpenPriority(false)}
                          isDisabled={false}
                          placeholder="აირჩიეთ პრიორიტეტი"
                          className="w-[25.9rem] mt-[1rem]"
                          classNamePrefix="react-select"
                          components={{
                            DropdownIndicator: () => null,
                            IndicatorSeparator: () => null,
                          }}
                          styles={customSelectStyles}
                        />
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: isOpenPriority ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none"
                        >
                          <IoIosArrowDown />
                        </motion.div>
                        {fieldState.error && (
                          <p className="text-red text-[1.2rem] mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    );
                  }}
                />
              )}
            </div>
            <div className="mb-8">
              <label className="block text-[1.6rem] text-darkGrey font-normal leading-[1]">
                სტატუსი*
              </label>
              {isLoadingStatuses ? (
                <p className="text-grey">Loading statuses...</p>
              ) : isErrorStatuses ? (
                <p className="text-red">Failed to load statuses</p>
              ) : (
                <Controller
                  name="status_id"
                  control={control}
                  rules={{ required: "სტატუსი სავალდებულოა" }}
                  render={({ field, fieldState }) => {
                    const selectedOption =
                      statusOptions.find(
                        (option) => option.value === field.value
                      ) || null;
                    return (
                      <div className="relative">
                        <Select
                          options={statusOptions}
                          value={selectedOption}
                          onChange={(selectedOption) =>
                            field.onChange(
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          onMenuOpen={() => setIsOpenStatus(true)}
                          onMenuClose={() => setIsOpenStatus(false)}
                          isDisabled={false}
                          placeholder="აირჩიეთ სტატუსი"
                          className="w-[25.9rem] mt-[1rem]"
                          classNamePrefix="react-select"
                          components={{
                            DropdownIndicator: () => null,
                            IndicatorSeparator: () => null,
                          }}
                          styles={customSelectStyles}
                        />
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: isOpenStatus ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none"
                        >
                          <IoIosArrowDown />
                        </motion.div>
                        {fieldState.error && (
                          <p className="text-red text-[1.2rem] mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    );
                  }}
                />
              )}
            </div>
          </div>
          <div className="ml-[16.1rem]">
            <label className="block text-[1.6rem] text-darkGrey font-normal leading-[1]">
              დედლაინი - თარიღი*
            </label>
            <input
              type="date"
              {...register("due_date", {
                required: "დედლაინი სავალდებულოა",
                validate: (value) =>
                  value >= today || "წარსული თარიღი მიუღებელია",
              })}
              min={today}
              className={`w-[31rem] mt-[1rem] border p-2 rounded-lg ${getInputBorderColor(
                dueDateValue,
                errors.due_date
              )}`}
            />
            {errors.due_date && (
              <p className="text-red text-[1.2rem] mt-1">
                {errors.due_date.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-[2rem] mt-[4.5rem]">
          <Button
            title="დავალების შექმნა"
            bgColor="bg-blueViolet"
            textColor="text-white"
            borderColor="border-transparent"
            disabled={!isValid}
          />
        </div>
      </form>
    </section>
  );
}

export default CreateForm;
