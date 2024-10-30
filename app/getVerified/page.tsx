"use client";
import VerificationForm from "@/components/forms/VerificationForm";

import React from "react";

type Props = {};

const GetVerified = (props: Props) => {
  return (
    <div className="pt-2 mb-5 text-center text-2xl sm:text-3xl font-semibold">
      <VerificationForm />
    </div>
  );
};

export default GetVerified;
