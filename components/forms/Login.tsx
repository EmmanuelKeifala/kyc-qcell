"use client";
import useAppStore from "@/lib/store";
import { useState } from "react";

const Login = () => {
  const { nextStep, setPhoneNumber } = useAppStore();
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setPhoneNumber(e.target.value);
  };

  const validateAndNext = () => {
    // Add validation logic here (e.g., format or length checks)
    if (1 == 1) {
      setError("Please enter a valid phone number.");
    } else {
      setError("");
      nextStep();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-center text-[#F78F1E]">
        Enter Your Phone Number
      </h2>

      <div className="mt-5">
        {error && <div className="font-bold text-red-600 mb-3">*{error}</div>}
        <div className="mb-6">
          <label className="text-lg font-medium text-gray-900" htmlFor="phone">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            placeholder="Enter your mobile number"
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-3 focus:outline-none focus:border-[#F78F1E] transition duration-300"
            required
          />
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-center mt-5">
        <button
          className="text-white bg-[#F78F1E] hover:bg-orange-600 px-5 py-2 rounded-lg text-lg sm:text-xl transition duration-300"
          onClick={validateAndNext}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
};

export default Login;
