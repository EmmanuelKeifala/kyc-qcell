"use server";
import { supabase } from "@/lib/supabase";
import { removeLeadingZero } from "@/lib/utils";

const TEST = "1"; // Set to "1" for testing mode

export async function SendOTP({ number }: { number: string }) {
  try {
    const formattedNumber = removeLeadingZero(number).startsWith("232")
      ? number
      : "232" + removeLeadingZero(number);

    const { data: existingUser, error: fetchError } = await supabase
      .from("verification_applicants")
      .select("phoneNumber, verificationStatus")
      .eq("phoneNumber", formattedNumber)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.log(fetchError);
      return {
        success: false,
        data: "Database error: unable to retrieve user",
      };
    }

    // Generate a new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const message = encodeURIComponent(
      `Your OTP is ${otp}. Please do not share it with anyone.`
    );

    if (existingUser && existingUser.verificationStatus === "verified") {
      return {
        success: false,
        data: "This phone number have already been verified",
      };
    }
    // Insert or update the OTP for the user
    let otpError;
    if (existingUser) {
      const { error } = await supabase
        .from("verification_applicants")
        .update({ otp })
        .eq("phoneNumber", formattedNumber);
      otpError = error;
    } else {
      const { error } = await supabase
        .from("verification_applicants")
        .insert([{ phoneNumber: formattedNumber, otp }]);
      otpError = error;
    }

    if (otpError) {
      console.log(otpError);
      return { success: false, data: "Failed to save OTP to the database." };
    }

    // Send OTP through external service
    const params = new URLSearchParams();
    params.append("username", process.env.NAME!);
    params.append("hash", process.env.HASH!);
    params.append("message", message);
    params.append("sender", encodeURIComponent("KYCVerify"));
    params.append("numbers", formattedNumber);
    params.append("test", TEST);

    const response = await fetch("https://api.txtlocal.com/send/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    console.log("data: ", data);

    if (data.status !== "success") {
      return { success: false, data: "Failed to send OTP message." };
    }

    return { success: true, data: "OTP sent successfully." };
  } catch (error) {
    console.log(error);
    return { success: false, data: "Unexpected server error." };
  }
}

export async function VerifyOTP({
  otp,
  number,
}: {
  otp: string;
  number: string;
}) {
  try {
    const formattedNumber = removeLeadingZero(number).startsWith("232")
      ? number
      : "232" + removeLeadingZero(number);

    const { data, error } = await supabase
      .from("verification_applicants")
      .select("otp")
      .eq("phoneNumber", formattedNumber)
      .single();

    if (error) {
      console.log(error);
      return { success: false, data: "No OTP found for this number." };
    }

    // Verify OTP
    if (data.otp !== otp) {
      return { success: false, data: "Incorrect OTP." };
    }

    return { success: true, data: "OTP verified successfully." };
  } catch (error) {
    console.log(error);
    return { success: false, data: "Unexpected server error." };
  }
}
