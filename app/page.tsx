"use client";
import AdminLoginModal from "@/components/AdminLogin";
import AnimatedArrow from "@/components/AnimatedArrow";
import StepCard from "@/components/StepCard";
import { Button } from "@/components/ui/button";
import { SearchParamProps } from "@/types";
import { motion } from "framer-motion";
import Link from "next/link";
const containerVariants = {
  visible: { transition: { staggerChildren: 0.5 } },
  hidden: {},
};

export default function Home({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams.admin === "true";
  return (
    <div className="relative">
      {isAdmin && <AdminLoginModal />}
      <div className="absolute z-[-1] bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_80%)]"></div>

      <div className="min-h-screen flex flex-col items-center pt-28 relative z-[10]">
        <h1 className="bg-gradient-to-r text-center from-gray-600 font-bold text-6xl to-gray-900 inline-block text-transparent bg-clip-text">
          Get Verified, <br />
          Secure Your{" "}
          <span className="text-[#F78F1E] font-bold">
            Qcell Connection.{" "}
          </span>{" "}
        </h1>

        <p className="text-xl mb-8 text-gray-600 max-w-xl text-center mt-4">
          Fast, secure, and reliable – complete your KYC in minutes and gain
          seamless access to{" "}
          <span className="text-[#F78F1E] font-bold">Qcell’s</span> services.
        </p>

        <div className="p-2 rounded-lg flex gap-5 ">
          <Link href="/getVerified" className="bg-[#8d5f2e] p-2 rounded-md">
            <Button type="button" variant={"link"} className="text-white">
              Get Started
            </Button>
          </Link>
          <Link
            href={"/?admin=true"}
            className="text-white bg-[#8d5f2e] p-2 rounded-md"
          >
            <Button type="button" variant={"link"} className="text-white">
              Dashboard
            </Button>
          </Link>
        </div>

        <div className="mt-4 max-w-5xl mx-auto">
          <h2 className="text-2xl  mb-6 text-center text-[#F78F1E] font-bold uppercase ">
            How It Works
          </h2>

          <motion.div
            className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <StepCard
              title="Enter Mobile Number"
              description="Start by entering your mobile number. We’ll send you a secure OTP to verify it’s you."
            />
            <AnimatedArrow />
            <StepCard
              title="Upload Your ID"
              description="Upload your government-issued ID. Our OCR will extract key details instantly."
            />
            <AnimatedArrow />
            <StepCard
              title="Take a Selfie"
              description="Snap a quick selfie to match with your ID photo, adding an extra layer of security."
            />
            <AnimatedArrow />
            <StepCard
              title="Get Verified"
              description="With successful verification, your account is activated and secured!"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
