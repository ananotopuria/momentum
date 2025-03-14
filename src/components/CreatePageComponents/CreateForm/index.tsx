import { useForm, FieldError, SubmitHandler } from "react-hook-form";
import Button from "../../CommonComponents/Button";
import { useDepartments } from "./../../../hooks/useDepartments";
import { useEmployees } from "../../../hooks/useEmployees";

interface FormData {
  title: string;
  description?: string;
  department_id: string;
  responsible_employee_id: string;
}

function CreateForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ mode: "onChange" });

  const { data: departments = [], isLoading: isLoadingDepartments, isError: isErrorDepartments } = useDepartments();
  const { data: employees = [], isLoading: isLoadingEmployees, isError: isErrorEmployees } = useEmployees();

  const titleValue = watch("title", "");
  const descriptionValue = watch("description", "") || "";
  const departmentValue = watch("department_id", "");
  const responsibleEmployeeValue = watch("responsible_employee_id", "");

  const getInputBorderColor = (value: string, error?: FieldError | undefined) => {
    if (value.length === 0) return "border-lightGrey";
    if (error) return "border-red";
    return "border-green";
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <section className="">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-[5.5rem] py-[6.5rem] bg-[#FBF9FFA6] border border-[#DDD2FF] rounded-sm mx-[11.8rem]"
      >
        <div className="flex gap-[16rem]">
          <div className="w-[55rem]">
            <label className="block text-[1.4rem] text-grey font-[400]">სათაური*</label>
            <input
              {...register("title", {
                required: "სავალდებულოა",
                minLength: { value: 3, message: "მინიმუმ 3 სიმბოლო" },
                maxLength: { value: 255, message: "მაქსიმუმ 255 სიმბოლო" },
              })}
              className={`w-full border p-2 rounded-lg ${getInputBorderColor(titleValue, errors.title)}`}
            />
            <p className={`text-[1.2rem] mt-1 ${errors.title ? "text-red" : titleValue.length >= 3 ? "text-green" : "text-lightGrey"}`}>
              &#x2713; მინიმუმ 3 სიმბოლო
            </p>
            <p className={`text-[1.2rem] ${errors.title ? "text-red" : titleValue.length > 255 ? "text-red" : titleValue.length >= 3 ? "text-green" : "text-lightGrey"}`}>
              &#x2713; მაქსიმუმ 255 სიმბოლო
            </p>
          </div>

          <div className="w-[55rem]">
            <label className="block text-[1.4rem] text-grey font-[400]">დეპარტამენტი*</label>
            {isLoadingDepartments ? (
              <p>Loading departments...</p>
            ) : isErrorDepartments ? (
              <p className="text-red">Failed to load departments</p>
            ) : (
              <select
                {...register("department_id", { required: "დეპარტამენტი სავალდებულოა" })}
                className={`w-full border p-2 rounded-lg ${getInputBorderColor(departmentValue, errors.department_id)}`}
              >
                <option value="">აირჩიეთ დეპარტამენტი</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            )}
            <p className={`text-[1.2rem] mt-1 ${errors.department_id ? "text-red" : departmentValue ? "text-green" : "text-lightGrey"}`}>
              &#x2713; სავალდებულოა
            </p>
          </div>
        </div>

        <div className="flex gap-[16rem]">
        <div className="w-[55rem] mt-[5.5rem]">
          <label className="block text-[1.4rem] text-grey font-[400]">აღწერა</label>
          <textarea
            {...register("description", {
              validate: (value) => {
                if (value && value.split(" ").length < 4) {
                  return "მინიმუმ 4 სიტყვა";
                }
                if (value && value.length > 255) {
                  return "მაქსიმუმ 255 სიმბოლო";
                }
                return true;
              },
            })}
            className={`w-full border p-2 rounded-lg ${getInputBorderColor(descriptionValue, errors.description)}`}
          />
          <p className={`text-[1.2rem] mt-1 ${errors.description ? "text-red" : descriptionValue.length >= 4 ? "text-green" : "text-lightGrey"}`}>
            &#x2713; მინიმუმ 4 სიტყვა
          </p>
          <p className={`text-[1.2rem] ${errors.description ? "text-red" : descriptionValue.length > 255 ? "text-red" : descriptionValue.length >= 4 ? "text-green" : "text-lightGrey"}`}>
            &#x2713; მაქსიმუმ 255 სიმბოლო
          </p>
        </div>

        <div className="w-[55rem] mt-[5.5rem]">
          <label className="block text-[1.4rem] text-grey font-[400]">პასუხისმგებელი თანამშრომელი*</label>
          {isLoadingEmployees ? (
            <p>Loading employees...</p>
          ) : isErrorEmployees ? (
            <p className="text-red">Failed to load employees</p>
          ) : (
            <select
              {...register("responsible_employee_id", { required: "პასუხისმგებელი თანამშრომელი სავალდებულოა" })}
              className={`w-full border p-2 rounded-lg ${getInputBorderColor(responsibleEmployeeValue, errors.responsible_employee_id)}`}
            >
              <option value="">აირჩიეთ თანამშრომელი</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} {emp.surname}
                </option>
              ))}
            </select>
          )}
          <p className={`text-[1.2rem] mt-1 ${errors.responsible_employee_id ? "text-red" : responsibleEmployeeValue ? "text-green" : "text-lightGrey"}`}>
            &#x2713; სავალდებულოა
          </p>
        </div>
        </div>

        <Button title="დავალების შექმნა" bgColor="bg-blueViolet" textColor="text-white" borderColor="border-transparent" />
      </form>
    </section>
  );
}

export default CreateForm;
