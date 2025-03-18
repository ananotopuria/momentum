import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { createPortal } from "react-dom";
import { IoIosCloseCircle, IoIosArrowDown } from "react-icons/io";
import axios from "axios";
import Select, { StylesConfig, CSSObjectWithLabel } from "react-select";
import { motion } from "framer-motion";
import { EmployeeForm, OptionType } from "../types";
import { useDepartments } from "../../../../hooks/useDepartments";
import ImageUpload from "../imageUpload";
import Button from "../../../CommonComponents/Button";
import { Department } from "../../../InnerPageComponents/types";


const customStyles: StylesConfig<OptionType, false> = {
  control: (base: CSSObjectWithLabel) => ({
    ...base,
    borderColor: "lighterGrey",
    boxShadow: "none",
    "&:hover": { borderColor: "blueViolet" },
  }),
  menu: (base: CSSObjectWithLabel) => ({
    ...base,
    backgroundColor: "white",
    zIndex: 100,
  }),
  option: (base: CSSObjectWithLabel, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "blueViolet"
      : state.isFocused
      ? "lavender"
      : "white",
    color: state.isSelected ? "white" : "black",
  }),
};

function EmployeeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, touchedFields, isValid },
  } = useForm<EmployeeForm>({
    mode: "onChange", 
  });

  const { data: departments = [], isLoading, isError } = useDepartments();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [isOpenSelect, setIsOpenSelect] = useState(false);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const isRequiredValid = (value: string) => value.trim() !== "";
  const isMinLengthValid = (value: string) => value.length >= 2;
  const isMaxLengthValid = (value: string) => value.length <= 255;
  const isPatternValid = (value: string) => /^[a-zA-Zა-ჰ]+$/.test(value);

  const getValidationColor = (
    touched: boolean | undefined,
    valid: boolean
  ) => {
    return !touched ? "text-gray-500" : valid ? "text-green" : "text-red";
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
    return () =>
      document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, handleOutsideClick]);

  const nameValue = watch("name", "");
  const surnameValue = watch("surname", "");

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
        <div className="fixed inset-0 flex items-center justify-center bg-[#0D0F1026] backdrop-blur-sm p-4 z-50 w-full h-full">
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
                      required: "სავალდებულო",
                      minLength: { value: 2, message: "მინიმუმ 2 სიმბოლო" },
                      maxLength: { value: 255, message: "მაქსიმუმ 255 სიმბოლო" },
                      validate: (value) =>
                        isPatternValid(value) ||
                        "მხოლოდ ლათინური და ქართული სიმბოლოები",
                    })}
                    className={`w-full border p-2 rounded-lg py-[1.4rem] px-[1rem] ${
                      !touchedFields.name
                        ? "border-gray-400"
                        : errors.name
                        ? "border-red"
                        : "border-green"
                    }`}
                  />
                  <p
                    className={`text-[1.2rem] mt-1 ${getValidationColor(
                      touchedFields.name,
                      isRequiredValid(nameValue)
                    )}`}
                  >
                    &#x2713; სავალდებულო
                  </p>
                  <p
                    className={`text-[1.2rem] ${getValidationColor(
                      touchedFields.name,
                      isMinLengthValid(nameValue)
                    )}`}
                  >
                    &#x2713; მინიმუმ 2 სიმბოლო
                  </p>
                  <p
                    className={`text-[1.2rem] ${getValidationColor(
                      touchedFields.name,
                      isMaxLengthValid(nameValue)
                    )}`}
                  >
                    &#x2713; მაქსიმუმ 255 სიმბოლო
                  </p>
                  <p
                    className={`text-[1.2rem] ${getValidationColor(
                      touchedFields.name,
                      isPatternValid(nameValue)
                    )}`}
                  >
                    &#x2713; მხოლოდ ლათინური და ქართული სიმბოლოები
                  </p>
                </div>
                <div className="w-[38rem]">
                  <label className="block text-[1.4rem] text-gray-700">
                    გვარი*
                  </label>
                  <input
                    {...register("surname", {
                      required: "სავალდებულო",
                      minLength: { value: 2, message: "მინიმუმ 2 სიმბოლო" },
                      maxLength: { value: 255, message: "მაქსიმუმ 255 სიმბოლო" },
                      validate: (value) =>
                        isPatternValid(value) ||
                        "მხოლოდ ლათინური და ქართული სიმბოლოები",
                    })}
                    className={`w-full border p-2 rounded-lg py-[1.4rem] px-[1rem] ${
                      !touchedFields.surname
                        ? "border-gray-400"
                        : errors.surname
                        ? "border-red"
                        : "border-green"
                    }`}
                  />
                  <p
                    className={`text-[1.2rem] mt-1 ${getValidationColor(
                      touchedFields.surname,
                      isRequiredValid(surnameValue)
                    )}`}
                  >
                    &#x2713; სავალდებულო
                  </p>
                  <p
                    className={`text-[1.2rem] ${getValidationColor(
                      touchedFields.surname,
                      isMinLengthValid(surnameValue)
                    )}`}
                  >
                    &#x2713; მინიმუმ 2 სიმბოლო
                  </p>
                  <p
                    className={`text-[1.2rem] ${getValidationColor(
                      touchedFields.surname,
                      isMaxLengthValid(surnameValue)
                    )}`}
                  >
                    &#x2713; მაქსიმუმ 255 სიმბოლო
                  </p>
                  <p
                    className={`text-[1.2rem] ${getValidationColor(
                      touchedFields.surname,
                      isPatternValid(surnameValue)
                    )}`}
                  >
                    &#x2713; მხოლოდ ლათინური და ქართული სიმბოლოები
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
                <div className="relative">
                  <Controller
                    control={control}
                    name="department_id"
                    rules={{ required: "სავალდებულო" }}
                    render={({ field }) => {
                      const options: OptionType[] = departments.map(
                        (dept: Department) => ({
                          value: dept.id.toString(),
                          label: dept.name,
                        })
                      );
                      const selectedOption =
                        options.find(
                          (option: OptionType) => option.value === field.value
                        ) || null;
                      return (
                        <Select
                          {...field}
                          options={options}
                          onChange={(selectedOption: OptionType | null) =>
                            field.onChange(
                              selectedOption ? selectedOption.value : null
                            )
                          }
                          value={selectedOption}
                          onMenuOpen={() => setIsOpenSelect(true)}
                          onMenuClose={() => setIsOpenSelect(false)}
                          className="w-[38.4rem] mt-1"
                          classNamePrefix="react-select"
                          components={{
                            DropdownIndicator: () => null,
                            IndicatorSeparator: () => null,
                          }}
                          styles={customStyles}
                        />
                      );
                    }}
                  />
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: isOpenSelect ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-[1.5rem] left-[36rem] transform -translate-y-1/2 pointer-events-none"
                  >
                    <IoIosArrowDown />
                  </motion.div>
                </div>
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
                  disabled={!isValid}
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
