import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { RiDeleteBinLine } from "react-icons/ri";
import { LuImageUp } from "react-icons/lu";
import { UseFormSetValue } from "react-hook-form";
import { EmployeeForm } from "../types";

interface ImageUploadProps {
  setValue: UseFormSetValue<EmployeeForm>;
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ setValue, error }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setValue("avatar", file as File, { shouldValidate: true });
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    setValue("avatar", null, { shouldValidate: true });
    setPreviewImage(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div className="mt-[4.5rem] flex flex-col text-[1.2rem]">
      <label className="text-[1.4rem] text-grey" htmlFor="image">ავატარი*</label>
      <div
        {...getRootProps()}
        className="border-2 border-dotted border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 mt-2 h-[12rem] flex items-center justify-center"
      >
        <input {...getInputProps()} />
        {previewImage ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-[9rem] h-[9rem] overflow-hidden rounded-full">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleDelete}
              className="absolute top-[80%] right-[45%] bg-white border border-[#6C757D] rounded-full p-2"
            >
              <RiDeleteBinLine className="text-[#6C757D] text-lg" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <LuImageUp className="text-4xl text-grey" />
            <p className=" text-grey mt-2">ატვირთე ფოტო</p>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default ImageUpload;
