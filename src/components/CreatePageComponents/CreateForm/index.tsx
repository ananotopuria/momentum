import { useEffect } from "react";
import { useForm, FieldError, SubmitHandler } from "react-hook-form";
import Button from "../../CommonComponents/Button";
import { useDepartments } from "./../../../hooks/useDepartments";
import { useEmployees } from "../../../hooks/useEmployees";
import { useStatuses } from "../../../hooks/useStatuses";
import { usePriorities } from "../../../hooks/usePriorities";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface FormData {
  title: string;
  description?: string;
  department_id: string;
  responsible_employee_id: string;
  status_id: string;
  priority_id: string;
  due_date: string;
}

function CreateForm() {
  const navigate = useNavigate();
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .split("T")[0];
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
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

  const titleValue = watch("title", "");
  const descriptionValue = watch("description", "") || "";
  const departmentValue = watch("department_id", "");
  const responsibleEmployeeValue = watch("responsible_employee_id", "");
  const dueDateValue = watch("due_date", tomorrow);
  const priorityValue = watch("priority_id", "");
  const statusValue = watch("status_id", "");

  const filteredEmployees = employees.filter((emp) => {
    const deptId =
      emp.department_id !== undefined ? emp.department_id : emp.department?.id;
    return deptId?.toString() === departmentValue;
  });
  console.log("Selected Department:", departmentValue);
  console.log("Filtered Employees:", filteredEmployees);

  const getInputBorderColor = (value: string, error?: FieldError) => {
    if (value.length === 0) return "border-lightGrey";
    if (error) return "border-red";
    return "border-green";
  };

  const isRequiredValid = (value: string) => value.trim() !== "";
  const isMinLengthValid = (value: string, min: number) => value.length >= min;
  const isMaxLengthValid = (value: string, max: number) => value.length <= max;
  const isMinWordCountValid = (value: string) => {
    if (!value) return true;
    return value.trim().split(/\s+/).length >= 4;
  };

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

    console.log("Submitting Task:", taskData);

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

  return (
    <section className="">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-[5.5rem] py-[6.5rem] bg-[#FBF9FFA6] border border-[#DDD2FF] rounded-sm mx-[11.8rem]"
      >
        <div className="flex gap-[16rem]">
          <div className="w-[55rem]">
            <label className="block text-[1.4rem] text-grey font-[400]">
              სათაური*
            </label>
            <input
              {...register("title", {
                required: "სავალდებულოა",
                minLength: { value: 3, message: "მინიმუმ 3 სიმბოლო" },
                maxLength: { value: 255, message: "მაქსიმუმ 255 სიმბოლო" },
              })}
              className={`w-full border p-2 rounded-lg ${getInputBorderColor(
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

          <div className="w-[55rem]">
            <label className="block text-[1.4rem] text-grey font-[400]">
              დეპარტამენტი*
            </label>
            {isLoadingDepartments ? (
              <p className="text-grey">Loading departments...</p>
            ) : isErrorDepartments ? (
              <p className="text-red">Failed to load departments</p>
            ) : (
              <select
                {...register("department_id", {
                  required: "დეპარტამენტი სავალდებულოა",
                })}
                className={`w-full border p-2 rounded-lg ${getInputBorderColor(
                  departmentValue,
                  errors.department_id
                )}`}
              >
                <option value="">აირჩიეთ დეპარტამენტი</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            )}
            <p
              className={`text-[1.2rem] mt-1 ${
                !touchedFields.department_id
                  ? "text-lightGrey"
                  : isRequiredValid(departmentValue)
                  ? "text-green"
                  : "text-red"
              }`}
            >
              &#x2713; სავალდებულოა
            </p>
          </div>
        </div>
        <div className="flex gap-[16rem]">
          <div className="w-[55rem] mt-[5.5rem]">
            <label className="block text-[1.4rem] text-grey font-[400]">
              აღწერა
            </label>
            <textarea
              {...register("description", {
                validate: (value) => {
                  if (value) {
                    if (!isMinWordCountValid(value)) {
                      return "მინიმუმ 4 სიტყვა";
                    }
                    if (!isMaxLengthValid(value, 255)) {
                      return "მაქსიმუმ 255 სიმბოლო";
                    }
                  }
                  return true;
                },
              })}
              className={`w-full border p-2 rounded-lg ${getInputBorderColor(
                descriptionValue,
                errors.description
              )}`}
            />
            <p
              className={`text-[1.2rem] mt-1 ${
                !touchedFields.description
                  ? "text-lightGrey"
                  : isMinWordCountValid(descriptionValue)
                  ? "text-green"
                  : "text-red"
              }`}
            >
              &#x2713; მინიმუმ 4 სიტყვა
            </p>
            <p
              className={`text-[1.2rem] ${
                !touchedFields.description
                  ? "text-lightGrey"
                  : isMaxLengthValid(descriptionValue, 255)
                  ? "text-green"
                  : "text-red"
              }`}
            >
              &#x2713; მაქსიმუმ 255 სიმბოლო
            </p>
          </div>

          {departmentValue && (
            <div className="w-[55rem] mt-[5.5rem]">
              <label className="block text-[1.4rem] text-grey font-[400]">
                პასუხისმგებელი თანამშრომელი*
              </label>
              {isLoadingEmployees ? (
                <p className="text-grey">Loading employees...</p>
              ) : isErrorEmployees ? (
                <p className="text-red">Failed to load employees</p>
              ) : (
                <select
                  {...register("responsible_employee_id", {
                    required: "პასუხისმგებელი თანამშრომელი სავალდებულოა",
                  })}
                  className={`w-full border p-2 rounded-lg ${getInputBorderColor(
                    responsibleEmployeeValue,
                    errors.responsible_employee_id
                  )}`}
                >
                  <option value="">აირჩიეთ თანამშრომელი</option>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} {emp.surname}
                      </option>
                    ))
                  ) : (
                    <option value="">
                      ამ დეპარტამენტში თანამშრომელი არ იძებნება
                    </option>
                  )}
                </select>
              )}
              <p
                className={`text-[1.2rem] mt-1 ${
                  !touchedFields.responsible_employee_id
                    ? "text-lightGrey"
                    : isRequiredValid(responsibleEmployeeValue)
                    ? "text-green"
                    : "text-red"
                }`}
              >
                &#x2713; სავალდებულოა
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-[16rem] mt-[5.5rem]">
          <div className="w-[55rem]">
            <label className="block text-[1.4rem] text-grey font-[400]">
              პრიორიტეტი*
            </label>
            {isLoadingPriorities ? (
              <p className="text-grey">Loading...</p>
            ) : isErrorPriorities ? (
              <p className="text-red">Failed to load</p>
            ) : (
              <select
                {...register("priority_id", {
                  required: "პრიორიტეტი სავალდებულოა",
                })}
                className={`w-full border p-2 rounded-lg ${getInputBorderColor(
                  priorityValue,
                  errors.priority_id
                )}`}
              >
                <option value="">აირჩიეთ პრიორიტეტი</option>
                {priorities.map((priority) => (
                  <option key={priority.id} value={priority.id}>
                    {priority.name}
                  </option>
                ))}
              </select>
            )}
            <p
              className={`text-[1.2rem] mt-1 ${
                !touchedFields.priority_id
                  ? "text-lightGrey"
                  : isRequiredValid(priorityValue)
                  ? "text-green"
                  : "text-red"
              }`}
            >
              &#x2713; სავალდებულოა
            </p>
          </div>

          <div className="w-[55rem]">
            <label className="block text-[1.4rem] text-grey font-[400]">
              სტატუსი*
            </label>
            {isLoadingStatuses ? (
              <p className="text-grey">Loading...</p>
            ) : isErrorStatuses ? (
              <p className="text-red">Failed to load</p>
            ) : (
              <select
                {...register("status_id", { required: "სტატუსი სავალდებულოა" })}
                className={`w-full border p-2 rounded-lg ${getInputBorderColor(
                  statusValue,
                  errors.status_id
                )}`}
              >
                <option value="">აირჩიეთ სტატუსი</option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            )}
            <p
              className={`text-[1.2rem] mt-1 ${
                !touchedFields.status_id
                  ? "text-lightGrey"
                  : isRequiredValid(statusValue)
                  ? "text-green"
                  : "text-red"
              }`}
            >
              &#x2713; სავალდებულოა
            </p>
          </div>
        </div>

        <div className="w-[55rem] mt-[5.5rem]">
          <label className="block text-[1.4rem] text-grey font-[400]">
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
            className={`w-full border p-2 rounded-lg ${getInputBorderColor(
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
