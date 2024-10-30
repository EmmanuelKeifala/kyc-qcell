import React, { useState } from "react";
import {
  CheckCircle,
  Upload,
  User,
  Phone,
  Shield,
  FileImage,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
  phoneNumber: string;
  otp: string;
  idCard: File | null;
  selfie: File | null;
}

const VerificationForm = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: "",
    otp: "",
    idCard: null,
    selfie: null,
  });
  const [phoneError, setPhoneError] = useState<string>("");
  const [previewUrls, setPreviewUrls] = useState<{
    idCard: string | null;
    selfie: string | null;
  }>({
    idCard: null,
    selfie: null,
  });

  const validatePhone = (number: string) => {
    // const phoneRegex = /^(031|034)\d{7}$/;
    if (1 != 1) {
      setPhoneError(
        "Phone number must start with 031 or 034 and be 11 digits long"
      );
      return false;
    }
    setPhoneError("");
    return true;
  };

  const sendOTP = () => {
    console.log("Sending OTP to", formData.phoneNumber);
  };

  const steps = [
    { title: "Phone", icon: <Phone className="w-5 h-5" /> },
    { title: "Verify", icon: <Shield className="w-5 h-5" /> },
    { title: "ID Card", icon: <FileImage className="w-5 h-5" /> },
    { title: "Selfie", icon: <User className="w-5 h-5" /> },
    { title: "Review", icon: <CheckCircle className="w-5 h-5" /> },
  ];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePhone(formData.phoneNumber)) {
      sendOTP();
      handleNext();
    }
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp) {
      handleNext();
    }
  };

  const handleFileUpload = (
    type: "idCard" | "selfie",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [type]: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrls((prev) => ({ ...prev, [type]: url }));
      handleNext();
    }
  };

  const removeImage = (type: "idCard" | "selfie") => {
    setFormData((prev) => ({ ...prev, [type]: null }));
    if (previewUrls[type]) {
      URL.revokeObjectURL(previewUrls[type]!);
      setPreviewUrls((prev) => ({ ...prev, [type]: null }));
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.title} className="flex items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
              ${
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
          {index < steps.length - 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`w-12 h-1 ${
                index + 1 < currentStep ? "bg-[#F78F1E]" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const ImagePreview = ({ type }: { type: "idCard" | "selfie" }) => (
    <div className="relative">
      <img
        src={previewUrls[type]!}
        alt={`${type} preview`}
        className="w-full h-64 object-contain rounded-lg"
      />
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2"
        onClick={() => removeImage(type)}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderStep = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        {(() => {
          switch (currentStep) {
            case 1:
              return (
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium text-left">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="Enter your phone number (031... or 034...)"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                      className="border-[#F78F1E] focus:ring-[#F78F1E] w-[50%] h-16"
                      required
                    />
                    {phoneError && (
                      <p className="text-red-500 text-sm">{phoneError}</p>
                    )}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="bg-[#F78F1E] hover:bg-[#E67D0E] text-white w-fit"
                    >
                      Send OTP
                    </Button>
                  </motion.div>
                </form>
              );

            case 2:
              return (
                <form onSubmit={handleOTPSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Enter OTP</label>
                    <Input
                      type="text"
                      placeholder="Enter OTP"
                      value={formData.otp}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          otp: e.target.value,
                        }))
                      }
                      className="border-[#F78F1E] focus:ring-[#F78F1E]"
                      required
                    />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-[#F78F1E] hover:bg-[#E67D0E] text-white"
                    >
                      Verify OTP
                    </Button>
                  </motion.div>
                </form>
              );

            case 3:
              return (
                <motion.div className="space-y-4" whileHover={{ scale: 1.02 }}>
                  {previewUrls.idCard ? (
                    <ImagePreview type="idCard" />
                  ) : (
                    <div className="border-2 border-dashed border-[#F78F1E] rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="idCard"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload("idCard", e)}
                      />
                      <label htmlFor="idCard" className="cursor-pointer">
                        <Upload className="mx-auto w-12 h-12 text-[#F78F1E]" />
                        <p className="mt-2 text-[#F78F1E] font-medium">
                          Upload ID Card Photo
                        </p>
                        <p className="text-sm text-gray-500">
                          Click to upload or drag and drop
                        </p>
                      </label>
                    </div>
                  )}
                </motion.div>
              );

            case 4:
              return (
                <motion.div className="space-y-4" whileHover={{ scale: 1.02 }}>
                  {previewUrls.selfie ? (
                    <ImagePreview type="selfie" />
                  ) : (
                    <div className="border-2 border-dashed border-[#F78F1E] rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="selfie"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload("selfie", e)}
                      />
                      <label htmlFor="selfie" className="cursor-pointer">
                        <Upload className="mx-auto w-12 h-12 text-[#F78F1E]" />
                        <p className="mt-2 text-[#F78F1E] font-medium">
                          Upload Selfie
                        </p>
                        <p className="text-sm text-gray-500">
                          Click to upload or drag and drop
                        </p>
                      </label>
                    </div>
                  )}
                </motion.div>
              );

            case 5:
              return (
                <div className="space-y-6">
                  <Alert className="border-[#F78F1E] bg-[#FFF5E9]">
                    <AlertDescription>
                      <div className="space-y-4">
                        <p>
                          <strong>Phone:</strong> {formData.phoneNumber}
                        </p>
                        <div>
                          <strong>ID Card:</strong>
                          {previewUrls.idCard && (
                            <img
                              src={previewUrls.idCard}
                              alt="ID Card"
                              className="mt-2 w-full h-48 object-contain rounded-lg"
                            />
                          )}
                        </div>
                        <div>
                          <strong>Selfie:</strong>
                          {previewUrls.selfie && (
                            <img
                              src={previewUrls.selfie}
                              alt="Selfie"
                              className="mt-2 w-full h-48 object-contain rounded-lg"
                            />
                          )}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => console.log("Submit verification")}
                      className="w-full bg-[#F78F1E] hover:bg-[#E67D0E] text-white"
                    >
                      Submit Verification
                    </Button>
                  </motion.div>
                </div>
              );

            default:
              return null;
          }
        })()}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="flex justify-center items-center min-h-screen py-10 px-4">
      <Card className="w-[60vw] border-[#F78F1E]/20">
        <CardContent className="pt-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center text-2xl font-semibold mb-6 text-[#F78F1E]"
          >
            Get Verified
          </motion.div>
          {renderStepIndicator()}
          <div className="mt-6">{renderStep()}</div>
          {currentStep > 1 && currentStep < 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4"
            >
              <Button
                variant="outline"
                onClick={handleBack}
                className="w-full border-[#F78F1E] text-[#F78F1E] hover:bg-[#FFF5E9]"
              >
                Back
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationForm;
