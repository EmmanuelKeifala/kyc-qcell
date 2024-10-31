import React from "react";
import { Button } from "./ui/button";

interface ReviewStepProps {
  formData: any;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => (
  <div className="space-y-6">
    <div>
      <strong>Phone:</strong> {formData.phoneNumber}
    </div>
    <div>
      <strong>ID Card:</strong>
      {formData.idCard && (
        <img src={URL.createObjectURL(formData.idCard)} alt="ID Card Preview" />
      )}
    </div>
    <div>
      <strong>Selfie:</strong>
      {formData.selfie && (
        <img src={URL.createObjectURL(formData.selfie)} alt="Selfie Preview" />
      )}
    </div>
    <Button className="bg-[#F78F1E] hover:bg-[#E67D0E] text-white w-full">
      Submit
    </Button>
  </div>
);

export default ReviewStep;
