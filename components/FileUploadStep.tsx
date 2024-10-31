import React from "react";
import { Upload } from "lucide-react";

interface FileUploadStepProps {
  type: "idCard" | "selfie";
  formData: any;
  setFormData: any;
  onNext: () => void;
}

const FileUploadStep: React.FC<FileUploadStepProps> = ({
  type,
  formData,
  setFormData,
  onNext,
}) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData((prev: any) => ({ ...prev, [type]: file }));
      onNext();
    }
  };

  return (
    <div className="border-2 border-dashed border-[#F78F1E] rounded-lg p-6 text-center">
      <input
        type="file"
        id={type}
        accept="image/*"
        onChange={handleFileUpload}
      />
      <label htmlFor={type} className="cursor-pointer">
        <Upload className="mx-auto w-12 h-12 text-[#F78F1E]" />
        <p className="mt-2 text-[#F78F1E] font-medium">
          Upload {type === "idCard" ? "ID Card" : "Selfie"}
        </p>
      </label>
    </div>
  );
};

export default FileUploadStep;
