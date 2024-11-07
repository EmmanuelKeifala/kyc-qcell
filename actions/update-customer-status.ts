"use server";
import { supabase } from "@/lib/supabase";
const TEST = "1"; // Set to "1" for testing mode

export async function UpdateCustomerStatus({
  phoneNumber,
  status,
}: {
  phoneNumber: string;
  status: string;
}) {
  try {
    const { data: updateMessage, error: updateError } = await supabase
      .from("verification_applicants")
      .update({ verificationStatus: status })
      .eq("phoneNumber", phoneNumber);

    if (updateError) {
      return { success: false, data: "Failed to update status" };
    }
    const message = `Your status have been updated to ${status}`;
    // Send OTP through external service
    const params = new URLSearchParams();
    params.append("username", process.env.NAME!);
    params.append("hash", process.env.HASH!);
    params.append("message", message);
    params.append("sender", "KycQcellVerification");
    params.append("numbers", phoneNumber);
    params.append("test", TEST);

    const response = await fetch("https://api.txtlocal.com/send/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    console.log({ data });

    if (data.status !== "success") {
      return { success: false, data: "Failed to send update message." };
    }
  } catch (error) {
    console.log(error);
    return { success: false, data: "Unexpected server error." };
  }
}
