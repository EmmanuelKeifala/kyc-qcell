"use client";
import Login from "@/components/forms/Login";
import useAppStore from "@/lib/store";
import React from "react";

type Props = {};

const GetVerified = (props: Props) => {
  const { step } = useAppStore();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Login />;
      case 2:
        return "<ExperienceInfo />";
      case 3:
        return "<EducationBackground />";
      case 4:
        return "<ReviewSubmit />";
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center py-10">
      <div className="bg-gray-100 rounded-lg w-full p-10 mx-5">
        <div className="pt-2 mb-5 text-center text-2xl sm:text-3xl font-semibold">
          Get Verified
        </div>
        {/* <ProgressBar /> */}

        {/* steps */}
        <div>{renderStep()}</div>
      </div>
    </div>
  );
};

export default GetVerified;
