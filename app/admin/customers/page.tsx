"use client";

import React from "react";

import Loader from "@/components/Loader";
import { useFetchVerificationApplicantsFlagged } from "@/hooks/useCustomerData";
import CustomerTable from "./_components/Table";

function Customers() {
  const { applicants, loading, error } = useFetchVerificationApplicantsFlagged(
    {}
  );

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="bg-white p-4 rounded-md flex-1 flex items-center justify-between mb-4">
        <h1 className="hidden md:block text-lg font-semibold text-[#F78F1E]">
          Customers
        </h1>
      </div>
      {/* Main Content */}
      <div className="w-full mt-6">
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <CustomerTable data={applicants} />
        )}
      </div>
    </div>
  );
}

export default Customers;
