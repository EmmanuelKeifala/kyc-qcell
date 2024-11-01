import React, { useState } from "react";
import {
  CheckCircle,
  Upload,
  User,
  Phone,
  Shield,
  FileImage,
  X,
  ArrowLeft,
  ArrowLeftCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { motion, AnimatePresence } from "framer-motion";
import { SendOTP, VerifyOTP } from "@/actions/send-otp";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import Loader from "../Loader";
import { supabase } from "@/lib/supabase";
import { ProcessImageOCR } from "@/actions/optical-character-recognition";
import { metadata } from "framer-motion/client";

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
  const [loading, setLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<{
    idCard: string | null;
    selfie: string | null;
  }>({
    idCard: null,
    selfie: null,
  });

  const steps = [
    { title: "Phone", icon: <Phone size={40} /> },
    { title: "Verify", icon: <Shield size={40} /> },
    { title: "ID Card", icon: <FileImage size={40} /> },
    { title: "Selfie", icon: <User size={40} /> },
    { title: "Review", icon: <CheckCircle size={40} /> },
  ];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    if (formData.phoneNumber.length !== 9) {
      toast.info("Please enter a valid 9-digit phone number.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoading(false);
      return;
    }
    try {
      const { success, data } = await SendOTP({ number: formData.phoneNumber });
      if (success) {
        // use tostify here
        toast.success("OTP sent successfully! Please check your phone.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        handleNext();
      } else {
        toast.error(`Failed to send OTP: ${data}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error(
        `An error occurred while sending the OTP. Please try again.`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    if (formData.otp.length !== 6) {
      toast.info("Please enter a valid 6-digit OTP.");
      setLoading(false);
      return;
    }

    try {
      const { success, data } = await VerifyOTP({
        number: formData.phoneNumber,
        otp: formData.otp,
      });

      if (success) {
        toast.success("OTP verified successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        handleNext();
      } else {
        toast.error(`Verification failed: ${data}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error(
        "An error occurred during OTP verification. Please try again.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    type: "idCard" | "selfie",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [type]: file }));
      const { error: uploadError } = await supabase.storage
        .from(`${type === "selfie" ? "selfie" : "idcards"}`)
        .upload(`${file.name}`, file);

      console.log("Filename: ", file.name);
      const { data } = supabase.storage
        .from(`${type === "selfie" ? "selfie" : "idcards"}`)
        .getPublicUrl(`${file.name}`);

      // This function should be utils
      function removeLeadingZero(num: string) {
        return num.startsWith("0") ? num.slice(1) : num;
      }
      const formattedNumber = removeLeadingZero(
        formData.phoneNumber
      ).startsWith("232")
        ? formData.phoneNumber
        : "232" + removeLeadingZero(formData.phoneNumber);
      const { data: idData } = await supabase
        .from("verification_applicants")
        .select("id")
        .eq("phoneNumber", formattedNumber)
        .single();

      if (type === "selfie") {
        const { error: urlError, data: urlData } = await supabase
          .from("verification_applicants")
          .update({ selfieUrl: data.publicUrl })
          .eq("id", idData?.id);
        console.log("Url Error: ", urlError, urlData);
      } else if (type === "idCard") {
        const { error: urlError, data: urlData } = await supabase
          .from("verification_applicants")
          .update({ idCardUrl: data.publicUrl })
          .eq("id", idData?.id);
        console.log("Url Error: ", urlError, urlData);
      }

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
            animate={{
              scale: 1,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: index * 0.1,
              },
            }}
            className={`flex items-center justify-center rounded-full border-2 w-fit h-fit p-3
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
              animate={{
                scaleX: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.1,
                },
              }}
              className={`w-12 h-1 ${
                index + 1 < currentStep ? "bg-[#F78F1E]" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const handleSubmit = async () => {
    try {
      // This function should be utils
      function removeLeadingZero(num: string) {
        return num.startsWith("0") ? num.slice(1) : num;
      }
      const formattedNumber = removeLeadingZero(
        formData.phoneNumber
      ).startsWith("232")
        ? formData.phoneNumber
        : "232" + removeLeadingZero(formData.phoneNumber);
      const { data } = await supabase
        .from("verification_applicants")
        .select("idCardUrl, id")
        .eq("phoneNumber", formattedNumber)
        .single();
      const responseFromOCR = await ProcessImageOCR({
        input: data?.idCardUrl,
      });

      await supabase
        .from("verification_applicants")
        .update({ metadata: responseFromOCR.data })
        .eq("id", data?.id);

      setFormData({
        phoneNumber: "",
        otp: "",
        idCard: null,
        selfie: null,
      });
      setPreviewUrls({ idCard: null, selfie: null });
      setCurrentStep(1);
    } catch (error) {
      console.log(error);
    }
  };
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  const ImagePreview = ({ type }: { type: "idCard" | "selfie" }) => (
    <div className="relative">
      <Image
        src={previewUrls[type]!}
        width={1000}
        height={1000}
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
        className="min-h-[300px] flex flex-col"
      >
        {(() => {
          switch (currentStep) {
            case 1:
              return (
                <form
                  onSubmit={handlePhoneSubmit}
                  className="space-y-6 flex-1 flex flex-col"
                >
                  <div className="space-y-2 flex-1">
                    <label className="text-16-semibold">Phone Number</label>
                    <InputOTP
                      maxLength={10}
                      value={formData.phoneNumber}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          phoneNumber: value,
                        }))
                      }
                    >
                      <InputOTPGroup className="shad-otp">
                        <InputOTPSlot index={0} className="shad-otp-slot" />
                        <InputOTPSlot index={1} className="shad-otp-slot" />
                        <InputOTPSlot index={2} className="shad-otp-slot" />
                        <InputOTPSeparator />
                        <InputOTPSlot index={3} className="shad-otp-slot" />
                        <InputOTPSlot index={4} className="shad-otp-slot" />
                        <InputOTPSlot index={5} className="shad-otp-slot" />
                        <InputOTPSlot index={6} className="shad-otp-slot" />
                        <InputOTPSlot index={7} className="shad-otp-slot" />
                        <InputOTPSlot index={8} className="shad-otp-slot" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {!loading ? (
                      <Button
                        type="submit"
                        className="bg-[#F78F1E] hover:bg-[#E67D0E] text-white w-full"
                      >
                        Send OTP
                      </Button>
                    ) : (
                      <Loader />
                    )}
                  </motion.div>
                </form>
              );

            case 2:
              return (
                <form
                  onSubmit={handleOTPSubmit}
                  className="space-y-6 flex-1 flex flex-col"
                >
                  <div className="space-y-4 flex-1">
                    <label className="text-16-semibold">Enter OTP</label>
                    <InputOTP
                      maxLength={6}
                      value={formData.otp}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          otp: value,
                        }))
                      }
                    >
                      <InputOTPGroup className="shad-otp">
                        <InputOTPSlot index={0} className="shad-otp-slot" />
                        <InputOTPSlot index={1} className="shad-otp-slot" />
                        <InputOTPSlot index={2} className="shad-otp-slot" />
                        <InputOTPSeparator />
                        <InputOTPSlot index={3} className="shad-otp-slot" />
                        <InputOTPSlot index={4} className="shad-otp-slot" />
                        <InputOTPSlot index={5} className="shad-otp-slot" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <div className="space-y-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {!loading ? (
                        <Button
                          type="submit"
                          className="bg-[#F78F1E] hover:bg-[#E67D0E] text-white w-full"
                        >
                          Verify OTP
                        </Button>
                      ) : (
                        <Loader />
                      )}
                    </motion.div>
                  </div>
                </form>
              );

            case 3:
              return (
                <div className="space-y-6 flex-1 flex flex-col">
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }}>
                    {previewUrls.idCard ? (
                      <ImagePreview type="idCard" />
                    ) : (
                      <div className="border-2 border-dashed border-[#F78F1E] rounded-lg p-6 text-center h-full flex flex-col items-center justify-center">
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
                </div>
              );

            case 4:
              return (
                <div className="space-y-6 flex-1 flex flex-col">
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }}>
                    {previewUrls.selfie ? (
                      <ImagePreview type="selfie" />
                    ) : (
                      <div className="border-2 border-dashed border-[#F78F1E] rounded-lg p-6 text-center h-full flex flex-col items-center justify-center">
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
                </div>
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
                      onClick={() => handleSubmit()}
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
          <motion.div className="flex items-center justify-between mb-4">
            <Link href={"/"}>
              <ArrowLeftCircle size={40} className="text-[#F78F1E]" />
            </Link>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center text-2xl font-semibold mb-6 text-[#F78F1E]"
            >
              Get Verified
            </motion.div>
            <div />
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
