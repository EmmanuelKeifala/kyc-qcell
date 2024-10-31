import React from "react";
import { motion } from "framer-motion";
import { Phone, Shield, FileImage, User, CheckCircle } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { title: "Phone", icon: <Phone size={40} /> },
  { title: "Verify", icon: <Shield size={40} /> },
  { title: "ID Card", icon: <FileImage size={40} /> },
  { title: "Selfie", icon: <User size={40} /> },
  { title: "Review", icon: <CheckCircle size={40} /> },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => (
  <div className="flex justify-center mb-8">
    {steps.map((step, index) => (
      <div key={step.title} className="flex items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`flex items-center justify-center rounded-full border-2 w-fit h-fit p-3 ${
            index + 1 === currentStep
              ? "border-[#F78F1E] bg-[#FFF5E9]"
              : index + 1 < currentStep
              ? "border-[#F78F1E] bg-[#F78F1E]"
              : "border-gray-300"
          }`}
        >
          <div className={index + 1 < currentStep ? "text-white" : ""}>
            {step.icon}
          </div>
        </motion.div>
      </div>
    ))}
  </div>
);

export default StepIndicator;
