import React from "react";
import { Button } from "@/components/ui/button";

interface OTPStepProps {
  formData: any;
  setFormData: any;
  onNext: () => void;
}

const OTPStep: React.FC<OTPStepProps> = ({ formData, setFormData, onNext }) => {
  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Verify OTP logic
    onNext();
  };

  return (
    <form onSubmit={handleOTPSubmit} className="space-y-6 flex-1 flex flex-col">
      <label className="text-16-semibold">Enter OTP</label>
      <input
        maxLength={6}
        value={formData.otp}
        onChange={(e) =>
          setFormData((prev: any) => ({ ...prev, otp: e.target.value }))
        }
      />
      <Button
        type="submit"
        className="bg-[#F78F1E] hover:bg-[#E67D0E] text-white w-full"
      >
        Verify OTP
      </Button>
    </form>
  );
};

export default OTPStep;
