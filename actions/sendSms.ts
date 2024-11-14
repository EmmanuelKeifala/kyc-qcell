"use server";
import { removeLeadingZero } from "@/lib/utils";

const TEST = "1"; // Set to "1" for testing mode

export async function SendSMS({
  message,
  number,
}: {
  message: string;
  number: string;
}) {
  try {
    const formattedNumber = removeLeadingZero(number).startsWith("232")
      ? number
      : "232" + removeLeadingZero(number);

    const params = new URLSearchParams();
    params.append("username", process.env.NAME!);
    params.append("hash", process.env.HASH!);
    params.append("message", encodeURIComponent(message));
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

    if (data.status !== "success") {
      return { success: false, data: "Failed to send OTP message." };
    }

    return { success: true, data: "Message Sent" };
  } catch (error) {
    console.log(error);
    return { success: false, data: "Unexpected server error." };
  }
}
