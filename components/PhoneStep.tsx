import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PhoneStepProps {
  formData: any;
  setFormData: any;
  onNext: () => void;
}

const PhoneStep: React.FC<PhoneStepProps> = ({
  formData,
  setFormData,
  onNext,
}) => {
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send OTP logic
    onNext();
  };

  return (
    <form
      onSubmit={handlePhoneSubmit}
      className="space-y-6 flex-1 flex flex-col"
    >
      <div className="space-y-2 flex-1">
        <label className="text-16-semibold">Phone Number</label>
        <Input
          maxLength={10}
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              phoneNumber: e.target.value,
            }))
          }
        />
      </div>
      <Button
        type="submit"
        className="bg-[#F78F1E] hover:bg-[#E67D0E] text-white w-full"
      >
        Send OTP
      </Button>
    </form>
  );
};

export default PhoneStep;
