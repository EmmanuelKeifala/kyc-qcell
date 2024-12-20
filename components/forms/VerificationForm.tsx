import React, { useState, useCallback } from "react";
import {
  CheckCircle,
  Upload,
  User,
  Phone,
  Shield,
  FileImage,
  X,
  ArrowLeftCircle,
  FileKey,
} from "lucide-react";
import { z } from "zod";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import NationalIDForm from "@/components/personalForm/NationalIDForm";
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
import { removeLeadingZero } from "@/lib/utils";
import { verifyKYC } from "@/actions/verification";
import { SendSMS } from "@/actions/sendSms";

interface FormData {
  phoneNumber: string;
  otp: string;
  idCard: File | null;
  selfie: File | null;
}

const phoneValidationSchema = z.object({
  phoneNumber: z.string().regex(/^(031|034)\d{6}$/, {
    message:
      "Phone number must start with 031 or 034 and be exactly 9 digits long",
  }),
});

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
    { title: "Personal Details", icon: <FileKey size={40} /> },
    { title: "ID Card", icon: <FileImage size={40} /> },
    { title: "Selfie", icon: <User size={40} /> },
    { title: "Review", icon: <CheckCircle size={40} /> },
  ];

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

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  }, [steps.length]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const formatPhoneNumber = useCallback((number: string) => {
    const cleaned = removeLeadingZero(number);
    return cleaned.startsWith("232") ? cleaned : `232${cleaned}`;
  }, []);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate the phone number using the Zod schema
      const validationResult = phoneValidationSchema.safeParse({
        phoneNumber: formData.phoneNumber,
      });

      if (!validationResult.success) {
        // Handle validation errors
        const errorMessage = validationResult.error.errors[0].message;
        toast.info(errorMessage);
        return;
      }

      // Additional check for phone length if needed
      const cleanedPhone = formData.phoneNumber.replace(/\s+/g, ""); // If any whitespace handling is required
      if (cleanedPhone.length !== 9) {
        toast.info("Please enter a valid 9-digit phone number.");
        return;
      }

      // Attempt to send OTP
      const { success, data } = await SendOTP({ number: cleanedPhone });
      if (success) {
        toast.success("OTP sent successfully! Please check your phone.");
        handleNext();
      } else {
        toast.error(`Failed to send OTP: ${data}`);
      }
    } catch (error) {
      toast.error("An error occurred while sending the OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.otp.length !== 6) {
        toast.info("Please enter a valid 6-digit OTP.");
        return;
      }

      const { success, data } = await VerifyOTP({
        number: formatPhoneNumber(formData.phoneNumber),
        otp: formData.otp,
      });

      if (success) {
        toast.success("OTP verified successfully!");
        handleNext();
      } else {
        toast.error(`Verification failed: ${data}`);
      }
    } catch (error) {
      toast.error(
        "An error occurred during OTP verification. Please try again."
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
    if (!file) return;

    try {
      setLoading(true);
      const fileName = `${Date.now()}-${file.name}`;
      const bucket = type === "selfie" ? "selfie" : "idcards";

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      // Update database
      const formattedNumber = formatPhoneNumber(formData.phoneNumber);
      const { data: userData, error: userError } = await supabase
        .from("verification_applicants")
        .select("id")
        .eq("phoneNumber", formattedNumber)
        .single();

      if (userError) throw userError;

      const updateField = type === "selfie" ? "selfieUrl" : "idCardUrl";
      const { error: updateError } = await supabase
        .from("verification_applicants")
        .update({ [updateField]: urlData.publicUrl })
        .eq("id", userData.id);

      if (updateError) throw updateError;

      // Update local state
      setFormData((prev) => ({ ...prev, [type]: file }));
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrls((prev) => ({ ...prev, [type]: previewUrl }));
      handleNext();
    } catch (error) {
      toast.error(`Failed to upload ${type}. Please try again.`);
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = useCallback(
    (type: "idCard" | "selfie") => {
      setFormData((prev) => ({ ...prev, [type]: null }));
      if (previewUrls[type]) {
        URL.revokeObjectURL(previewUrls[type]!);
        setPreviewUrls((prev) => ({ ...prev, [type]: null }));
      }
    },
    [previewUrls]
  );

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Step 1: Get verification applicant data
      const formattedNumber = formatPhoneNumber(formData.phoneNumber);
      const { data: applicantData, error: applicantError } = await supabase
        .from("verification_applicants")
        .select("idCardUrl, id")
        .eq("phoneNumber", formattedNumber)
        .single();

      if (applicantError) {
        throw new Error(
          `Failed to fetch applicant data: ${applicantError.message}`
        );
      }

      if (!applicantData?.idCardUrl) {
        throw new Error("No ID card URL found for this applicant");
      }

      // Step 2: Process image with OCR
      const responseFromOCR = await ProcessImageOCR({
        input: applicantData.idCardUrl,
      });

      if (!responseFromOCR?.data) {
        throw new Error("OCR processing failed to return data");
      }

      // Step 3: Update applicant metadata
      const { data: metaData, error: updateError } = await supabase
        .from("verification_applicants")
        .update({ metadata: responseFromOCR.data })
        .eq("id", applicantData.id)
        .select("metadata, personal_detail")
        .single();

      if (updateError) {
        throw new Error(`Failed to update metadata: ${updateError.message}`);
      }

      const parsedMetaData = metaData?.metadata;
      const parsedPersonalData = metaData?.personal_detail;

      if (!parsedMetaData || !parsedPersonalData) {
        throw new Error("Missing required verification data");
      }

      // Step 4: Prepare verification data
      const personalDetails = {
        lastName: parsedPersonalData?.surname,
        firstName: parsedPersonalData?.name,
        middleName: parsedPersonalData?.middleName,
        dateOfBirth: parsedPersonalData?.dateOfBirth,
        height: parsedPersonalData?.height,
        personalIdNumber: parsedPersonalData?.personalIDNumber,
        expiryDate: parsedPersonalData?.expiryDate,
      };

      const metaDetails = {
        title: parsedMetaData?.title,
        firstName: parsedMetaData?.name,
        middleName: parsedMetaData?.middleName,
        dateOfBirth: parsedMetaData?.dateOfBirth,
        height: parsedMetaData?.height,
        personalIdNumber: parsedMetaData?.personalIDNumber,
        expiryDate: parsedMetaData?.expiryDate,
      };

      // Step 5: Perform KYC verification
      const result = await verifyKYC(personalDetails, metaDetails);

      await supabase
        .from("verification_applicants")
        .update({ reason: result.reasons, verificationStatus: result.status })
        .eq("id", applicantData.id);

      // Show success toast
      toast.success(
        "Your verification has been successfully submitted. You will receive an SMS with the results shortly."
      );

      setFormData({
        phoneNumber: "",
        otp: "",
        idCard: null,
        selfie: null,
      });
      setPreviewUrls({ idCard: null, selfie: null });
      setCurrentStep(1);

      await SendSMS({
        number: formattedNumber,
        message: `Your verification has been submitted successfully. Your verification status is ${result.status}.`,
      }).then((response) => {
        if (response.success) {
          toast.success("SMS sent successfully!");
        } else {
          toast.error("Failed to send SMS. Please try again.");
        }
      });
    } catch (error) {
      console.error("Submission error:", error);

      // Show error toast
      toast.error("Failed to submit verification. Please try again.");

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const ImagePreview = ({ type }: { type: "idCard" | "selfie" }) => (
    <div className="relative">
      {previewUrls[type] && (
        <>
          <Image
            src={previewUrls[type]!}
            alt={`${type} preview`}
            width={1000}
            height={1000}
            className="w-full h-64 object-contain rounded-lg"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => removeImage(type)}
            aria-label={`Remove ${type} image`}
          >
            <X className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  );
  const renderStepIndicator = () => (
    <div className="flex justify-center mb-4 md:mb-8 overflow-x-auto px-2 md:px-0">
      <div className="flex items-center min-w-fit">
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
              className={`flex items-center justify-center rounded-md border-2 
                ${
                  index + 1 === currentStep
                    ? "border-[#F78F1E] bg-[#FFF5E9]"
                    : index + 1 < currentStep
                    ? "border-[#F78F1E] bg-[#F78F1E]"
                    : "border-gray-300"
                }
                w-8 h-8 md:w-12 md:h-12 p-4 md:p-3 cursor-pointer text-sm md:text-base
              `}
            >
              <div
                className={`${
                  index + 1 < currentStep ? "text-white" : ""
                } scale-75 md:scale-100`}
              >
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
                className={`w-6 md:w-12 h-0.5 md:h-1 ${
                  index + 1 < currentStep ? "bg-[#F78F1E]" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
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
        className="min-h-[250px] md:min-h-[300px] flex flex-col"
      >
        {(() => {
          switch (currentStep) {
            case 1:
              return (
                <form
                  onSubmit={handlePhoneSubmit}
                  className="space-y-4 md:space-y-6 flex-1 flex flex-col"
                >
                  <div className="space-y-2 flex-1">
                    <label className="text-sm md:text-base font-semibold">
                      Phone Number
                    </label>
                    <div className="max-w-full overflow-x-auto">
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
                        <InputOTPGroup className="shad-otp gap-1 md:gap-2">
                          <InputOTPSlot
                            index={0}
                            className="shad-otp-slot !w-8 md:!w-10 !h-10 md:!h-12"
                          />
                          <InputOTPSlot
                            index={1}
                            className="shad-otp-slot !w-8 md:!w-10 !h-10 md:!h-12"
                          />
                          <InputOTPSlot
                            index={2}
                            className="shad-otp-slot !w-8 md:!w-10 !h-10 md:!h-12"
                          />
                          <InputOTPSeparator />
                          <InputOTPSlot
                            index={3}
                            className="shad-otp-slot !w-8 md:!w-10 !h-10 md:!h-12"
                          />
                          <InputOTPSlot
                            index={4}
                            className="shad-otp-slot !w-8 md:!w-10 !h-10 md:!h-12"
                          />
                          <InputOTPSlot
                            index={5}
                            className="shad-otp-slot !w-8 md:!w-10 !h-10 md:!h-12"
                          />
                          <InputOTPSlot
                            index={6}
                            className="shad-otp-slot !w-8 md:!w-10 !h-10 md:!h-12"
                          />
                          <InputOTPSlot
                            index={7}
                            className="shad-otp-slot !w-8 md:!w-10 !h-10 md:!h-12"
                          />
                          <InputOTPSlot
                            index={8}
                            className="shad-otp-slot !w-8 md:!w-10 !h-10 md:!h-12"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {!loading ? (
                      <Button
                        type="submit"
                        className="bg-[#F78F1E] hover:bg-[#E67D0E] text-white w-full h-10 md:h-12"
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
                  className="space-y-4 md:space-y-6 flex-1 flex flex-col"
                >
                  <div className="space-y-4 flex-1">
                    <label className="text-sm md:text-base font-semibold">
                      Enter OTP
                    </label>
                    <div className="max-w-full overflow-x-auto">
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
                        <InputOTPGroup className="shad-otp gap-1 md:gap-2">
                          <InputOTPSlot
                            index={0}
                            className="shad-otp-slot !w-8 md:!w-10 !h-10 md:!h-12"
                          />
                          <InputOTPSlot
                            index={1}
                            className="shad-otp-slot !w-8 md:!w-10 !h-10 md:!h-12"
                          />
                          <InputOTPSlot
                            index={2}
                            className="shad-otp-slot !w-8 md:!w-10 !h-10 md:!h-12"
                          />
                          <InputOTPSeparator />
                          <InputOTPSlot
                            index={3}
                            className="shad-otp-slot !w-8 md:!w-10 !h-10 md:!h-12"
                          />
                          <InputOTPSlot
                            index={4}
                            className="shad-otp-slot !w-8 md:!w-10 !h-10 md:!h-12"
                          />
                          <InputOTPSlot
                            index={5}
                            className="shad-otp-slot !w-8 md:!w-10 !h-10 md:!h-12"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {!loading ? (
                      <Button
                        type="submit"
                        className="bg-[#F78F1E] hover:bg-[#E67D0E] text-white w-full h-10 md:h-12"
                      >
                        Verify OTP
                      </Button>
                    ) : (
                      <Loader />
                    )}
                  </motion.div>
                </form>
              );

            case 3:
              return (
                <div>
                  <NationalIDForm
                    phoneNumber={formData.phoneNumber}
                    onNext={() => handleNext()}
                  />
                </div>
              );

            case 4:
              const type = currentStep === 4 ? "idCard" : "selfie";
              return (
                <div className="space-y-4 md:space-y-6 flex-1 flex flex-col">
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }}>
                    {previewUrls[type] ? (
                      <ImagePreview type={type} />
                    ) : (
                      <div className="border-2 border-dashed border-[#F78F1E] rounded-lg p-4 md:p-6 text-center h-full flex flex-col items-center justify-center">
                        <input
                          type="file"
                          id={type}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(type, e)}
                        />
                        <label htmlFor={type} className="cursor-pointer">
                          <Upload className="mx-auto w-8 h-8 md:w-12 md:h-12 text-[#F78F1E]" />
                          <p className="mt-2 text-[#F78F1E] font-medium text-sm md:text-base">
                            Upload{" "}
                            {type === "idCard" ? "ID Card Photo" : "Selfie"}
                          </p>
                          <p className="text-xs md:text-sm text-gray-500">
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

            case 6:
              return (
                <div className="space-y-4 md:space-y-6">
                  <Alert className="border-[#F78F1E] bg-[#FFF5E9]">
                    <AlertDescription>
                      <div className="space-y-4">
                        <p className="text-sm md:text-base">
                          <strong>Phone:</strong> {formData.phoneNumber}
                        </p>
                        <div>
                          <strong className="text-sm md:text-base">
                            ID Card:
                          </strong>
                          {previewUrls.idCard && (
                            <img
                              src={previewUrls.idCard}
                              alt="ID Card"
                              className="mt-2 w-full h-32 md:h-48 object-contain rounded-lg"
                            />
                          )}
                        </div>
                        <div>
                          <strong className="text-sm md:text-base">
                            Selfie:
                          </strong>
                          {previewUrls.selfie && (
                            <img
                              src={previewUrls.selfie}
                              alt="Selfie"
                              className="mt-2 w-full h-32 md:h-48 object-contain rounded-lg"
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
                    {!loading ? (
                      <Button
                        onClick={() => handleSubmit()}
                        className="w-full bg-[#F78F1E] hover:bg-[#E67D0E] text-white h-10 md:h-12"
                      >
                        Submit Verification
                      </Button>
                    ) : (
                      <Loader />
                    )}
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
    <div className="flex justify-center items-center min-h-screen py-4 md:py-10 px-2 md:px-4">
      <Card className="w-full max-w-sm md:max-w-2xl border-[#F78F1E]/20">
        <CardContent className="pt-4 md:pt-6">
          <motion.div className="flex items-center justify-between mb-4">
            <Link href="/">
              <ArrowLeftCircle
                size={32}
                className="text-[#F78F1E] md:w-10 md:h-10"
              />
            </Link>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center text-lg md:text-2xl font-semibold mb-4 md:mb-6 text-[#F78F1E]"
            >
              Get Verified
            </motion.div>
            <div className="w-8 md:w-10" />
          </motion.div>
          {renderStepIndicator()}
          <div className="mt-4 md:mt-6">{renderStep()}</div>
          {currentStep > 1 && currentStep < 6 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 md:mt-4"
            >
              <Button
                variant="outline"
                onClick={handleBack}
                className="w-full border-[#F78F1E] text-[#F78F1E] hover:bg-[#FFF5E9] h-10 md:h-12"
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
