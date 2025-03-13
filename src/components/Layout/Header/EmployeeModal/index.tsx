import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, FieldError } from "react-hook-form";
import { createPortal } from "react-dom";
import axios from "axios";
import { IoIosCloseCircle } from "react-icons/io";
import Button from "../../../CommonComponents/Button";

interface Department {
  id: number;
  name: string;
}

interface EmployeeForm {
  name: string;
  surname: string;
  avatar: FileList;
  department_id: string;
}

const EmployeeModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<EmployeeForm>({ mode: "onChange" });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      axios
        .get<Department[]>(
          "https://momentum.redberryinternship.ge/api/departments"
        )
        .then((response) => setDepartments(response.data))
        .catch((error) => console.error("Error fetching departments:", error));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const validateName = (value: string) => /^[a-zA-Zა-ჰ]+$/i.test(value);

  const validateAvatar = (file?: FileList) => {
    if (!file || file.length === 0) return "Avatar is required";
    if (file[0].size > 600 * 1024) return "File size must be under 600KB";
    if (!file[0].type.startsWith("image/")) return "File must be an image";
    return true;
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
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("surname", data.surname);
    formData.append("avatar", data.avatar[0]);
    formData.append("department_id", data.department_id);

    axios
      .post("https://momentum.redberryinternship.ge/api/employees", formData)
      .then(() => {
        reset();
        onClose();
      })
      .catch((error) => console.error("Error creating employee:", error));
  };

  const nameValue = watch("name", "");
  const surnameValue = watch("surname", "");

  const getInputBorderColor = (
    value: string,
    error: FieldError | undefined
  ) => {
    if (value.length === 0) return "border-black";
    if (error) return "border-red-500";
    return "border-green-500";
  };

  return isOpen
    ? createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-[#0D0F1026] backdrop-blur-sm p-4 z-50 w-full h-full mx-auto my-auto">
          <div
            ref={dialogRef}
            className="bg-white rounded-lg px-[5rem] py-[10rem] w-[90rem] h-[70rem] relative"
          >
            <button
              onClick={onClose}
              className="absolute top-[4rem] right-[5rem] rounded-full cursor-pointer"
            >
              <IoIosCloseCircle className="w-[4rem] h-[4rem] text-[#DEE2E6]" />
            </button>
            <h2 className="text-[3.2rem] font-[500] text-center text-grey">
              თანამშრომლის დამატება
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-[4rem]">
              <div className="flex justify-between items-center">
                <div className="w-[38rem]">
                  <label className="block text-[1.4rem]">სახელი*</label>
                  <input
                    {...register("name", {
                      required: "მინიმუმ 2 სიმბოლო",
                      minLength: { value: 2, message: "მინიმუმ 2 სიმბოლო" },
                      maxLength: { value: 255, message: "მინიმუმ 255 სიმბოლო" },
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
                        ? "text-red-500"
                        : nameValue.length >= 2
                        ? "text-green-500"
                        : "text-black"
                    }`}
                  >
                    მინიმუმ 2 სიმბოლო
                  </p>
                  <p
                    className={`text-[1.2rem] ${
                      errors.name
                        ? "text-red-500"
                        : nameValue.length > 255
                        ? "text-red-500"
                        : nameValue.length >= 2
                        ? "text-green-500"
                        : "text-black"
                    }`}
                  >
                    მინიმუმ 255 სიმბოლო
                  </p>
                </div>

                <div className="w-[38rem]">
                  <label className="block text-[1.4rem]">გვარი*</label>
                  <input
                    {...register("surname", {
                      required: "მინიმუმ 2 სიმბოლო",
                      minLength: { value: 2, message: "მინიმუმ 2 სიმბოლო" },
                      maxLength: { value: 255, message: "მინიმუმ 255 სიმბოლო" },
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
                        ? "text-red-500"
                        : surnameValue.length >= 2
                        ? "text-green-500"
                        : "text-black"
                    }`}
                  >
                    მინიმუმ 2 სიმბოლო
                  </p>
                  <p
                    className={`text-[1.2rem] ${
                      errors.surname
                        ? "text-red-500"
                        : surnameValue.length > 255
                        ? "text-red-500"
                        : surnameValue.length >= 2
                        ? "text-green-500"
                        : "text-black"
                    }`}
                  >
                    მინიმუმ 255 სიმბოლო
                  </p>
                </div>
              </div>

              <label className="block mt-2">ავატარი*</label>
              <input
                type="file"
                {...register("avatar", { validate: validateAvatar })}
                onChange={(e) => {
                  setValue("avatar", e.target.files as FileList);
                  setAvatarPreview(
                    e.target.files?.[0]
                      ? URL.createObjectURL(e.target.files[0])
                      : null
                  );
                }}
                className="w-full border p-2"
              />
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="mt-2 w-20 h-20 object-cover rounded-full"
                />
              )}

              <label className="block mt-2">დეპარტამენტი*</label>
              <select
                {...register("department_id", { required: "Required" })}
                className="w-full border p-2"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-[2rem] mt-4">
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
};

export default EmployeeModal;
