import { useForm, FieldError, SubmitHandler } from "react-hook-form";
import Button from "../../CommonComponents/Button";

interface FormData {
  title: string;
  description?: string;
}

function CreateForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ mode: "onChange" });

  const titleValue = watch("title", "");
  const descriptionValue = watch("description", "") || "";

  const getInputBorderColor = (
    value: string,
    error?: FieldError | undefined
  ) => {
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
            className={`text-[1.2rem] mt-1 ${
              errors.title
                ? "text-red"
                : titleValue.length >= 3
                ? "text-green"
                : "text-lightGrey"
            }`}
          >
            &#x2713; მინიმუმ 3 სიმბოლო
          </p>
          <p
            className={`text-[1.2rem] ${
              errors.title
                ? "text-red"
                : titleValue.length > 255
                ? "text-red"
                : titleValue.length >= 3
                ? "text-green"
                : "text-lightGrey"
            }`}
          >
            &#x2713; მაქსიმუმ 255 სიმბოლო
          </p>
        </div>

        <div className="w-[55rem] mt-[5.5rem]">
          <label className="block text-[1.4rem] text-grey font-[400]">
            აღწერა
          </label>
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
            className={`w-full border p-2 rounded-lg ${getInputBorderColor(
              descriptionValue,
              errors.description
            )}`}
          />
          <p
            className={`text-[1.2rem] mt-1 ${
              errors.description
                ? "text-red"
                : descriptionValue.length >= 4
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
                : descriptionValue.length >= 4
                ? "text-green"
                : "text-lightGrey"
            }`}
          >
            &#x2713; მაქსიმუმ 255 სიმბოლო
          </p>
        </div>
        <Button
          title="დავალების შექმნა"
          bgColor="bg-blueViolet"
          textColor="text-white"
          borderColor="border-transparent"
        />
      </form>
    </section>
  );
}

export default CreateForm;
