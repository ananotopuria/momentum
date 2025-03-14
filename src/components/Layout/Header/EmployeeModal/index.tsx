import { useEffect, useRef, useCallback } from "react";
import { useForm, FieldError } from "react-hook-form";
import { createPortal } from "react-dom";
import { IoIosCloseCircle } from "react-icons/io";
import Button from "../../../CommonComponents/Button";
import ImageUpload from "./../imageUpload";
import { EmployeeForm } from "../types";
import { useDepartments } from "./../../../../hooks/useDepartments";
import axios from "axios";

function EmployeeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<EmployeeForm>({ mode: "onChange" });

  const { data: departments = [], isLoading, isError } = useDepartments();
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const validateName = (value: string) => /^[a-zA-Zა-ჰ]+$/i.test(value);
  const nameValue = watch("name", "");
  const surnameValue = watch("surname", "");

  const getInputBorderColor = (value: string, error?: FieldError) => {
    if (value.length === 0) return "border-gray-400";
    if (error) return "border-red";
    return "border-green";
  };

  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, handleOutsideClick]);

  const onSubmit = (data: EmployeeForm) => {
    if (!data.avatar) {
      console.error("Avatar is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("surname", data.surname);
    formData.append("avatar", data.avatar);
    formData.append("department_id", data.department_id);

    axios
      .post("https://momentum.redberryinternship.ge/api/employees", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer 9e69afcb-2aa2-4cb2-9841-a898e8708a26`,
        },
      })
      .then(() => {
        reset();
        onClose();
      })
      .catch((error) => console.error("Error creating employee:", error));
  };

  return isOpen
    ? createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-[#0D0F1026] backdrop-blur-sm p-4 z-50 w-full h-full mx-auto my-auto">
          <div
            ref={dialogRef}
            className="bg-white rounded-lg px-[5rem] py-[10rem] w-[90rem] h-[76rem] relative"
          >
            <button
              onClick={onClose}
              className="absolute top-[4rem] right-[5rem] rounded-full cursor-pointer"
            >
              <IoIosCloseCircle className="w-[4rem] h-[4rem] text-[#DEE2E6]" />
            </button>
            <h2 className="text-[3.2rem] font-[500] text-center text-gray-700">
              თანამშრომლის დამატება
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-[4rem]">
              <div className="flex justify-between items-center">
                <div className="w-[38rem]">
                  <label className="block text-[1.4rem] text-gray-700">
                    სახელი*
                  </label>
                  <input
                    {...register("name", {
                      required: "მინიმუმ 2 სიმბოლო",
                      minLength: { value: 2, message: "მინიმუმ 2 სიმბოლო" },
                      maxLength: {
                        value: 255,
                        message: "მინიმუმ 255 სიმბოლო",
                      },
                      validate: validateName,
                    })}
                    className={`w-full border p-2 rounded-lg py-[1.4rem] px-[1rem] ${getInputBorderColor(
                      nameValue,
                      errors.name
                    )}`}
                  />
                  <p
                    className={`text-[1.2rem] mt-1 ${
                      errors.name
                        ? "text-red"
                        : nameValue.length >= 2
                        ? "text-green"
                        : "text-gray-500"
                    }`}
                  >
                    &#x2713; მინიმუმ 2 სიმბოლო
                  </p>
                  <p
                    className={`text-[1.2rem] ${
                      errors.name
                        ? "text-red"
                        : nameValue.length > 255
                        ? "text-red"
                        : nameValue.length >= 2
                        ? "text-green"
                        : "text-[#6C757D]"
                    }`}
                  >
                    &#x2713; მინიმუმ 255 სიმბოლო
                  </p>
                </div>
                <div className="w-[38rem]">
                  <label className="block text-[1.4rem] text-gray-700">
                    გვარი*
                  </label>
                  <input
                    {...register("surname", {
                      required: "მინიმუმ 2 სიმბოლო",
                      minLength: { value: 2, message: "მინიმუმ 2 სიმბოლო" },
                      maxLength: {
                        value: 255,
                        message: "მინიმუმ 255 სიმბოლო",
                      },
                      validate: validateName,
                    })}
                    className={`w-full border p-2 rounded-lg py-[1.4rem] px-[1rem] ${getInputBorderColor(
                      surnameValue,
                      errors.surname
                    )}`}
                  />
                  <p
                    className={`text-[1.2rem] mt-1 ${
                      errors.surname
                        ? "text-red"
                        : surnameValue.length >= 2
                        ? "text-green"
                        : "text-gray-500"
                    }`}
                  >
                    &#x2713; მინიმუმ 2 სიმბოლო
                  </p>
                  <p
                    className={`text-[1.2rem] ${
                      errors.name
                        ? "text-red"
                        : nameValue.length > 255
                        ? "text-red"
                        : nameValue.length >= 2
                        ? "text-green"
                        : "text-[#6C757D]"
                    }`}
                  >
                    &#x2713; მინიმუმ 255 სიმბოლო
                  </p>
                </div>
              </div>

              <ImageUpload setValue={setValue} error={errors.avatar?.message} />

              <label className="block mt-[4.5rem] text-gray-700 text-[1.4rem] font-[500]">
                დეპარტამენტი*
              </label>
              {isLoading ? (
                <p className="text-gray-500">Loading departments...</p>
              ) : isError ? (
                <p className="text-red">Failed to load departments</p>
              ) : (
                <select
                  {...register("department_id", { required: "Required" })}
                  className="w-[38rem] border p-2 rounded-lg py-[1.4rem] px-[1rem]"
                >
                  <option value="">აირჩიეთ დეპარტამენტი</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              )}

              <div className="flex justify-end gap-[2rem] mt-[4.5rem]">
                <Button
                  title="გაუქმება"
                  bgColor="bg-white"
                  textColor="text-blueViolet"
                  borderColor="border-blueViolet"
                  onClick={onClose}
                />
                <Button
                  title="დაამატე თანამშრომელი"
                  bgColor="bg-blueViolet"
                  textColor="text-white"
                  borderColor="border-transparent"
                  onClick={handleSubmit(onSubmit)}
                />
              </div>
            </form>
          </div>
        </div>,
        document.getElementById("modal-root")!
      )
    : null;
}

export default EmployeeModal;
