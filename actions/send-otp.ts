const TEST = "1"; // Set to "1" for testing mode

export async function SendOTP(req: Request, res: Response) {
  try {
    const { number } = await req.json();

    function removeLeadingZero(number: { toString: () => any }) {
      const numStr = number.toString();

      return numStr.startsWith("0") ? numStr.slice(1) : numStr;
    }
    const formattedNumber = removeLeadingZero(number).startsWith("232")
      ? number
      : "232" + removeLeadingZero(number);

    const otpGenerator = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };
    const otp = otpGenerator();
    const message = encodeURIComponent(
      `Your OTP is ${otp}. Please do not share it with anyone.`
    );

    //STORE USER INFO

    // SEND OTP
    const params = new URLSearchParams();

    params.append("username", process.env.NAME!);
    params.append("hash", process.env.HASH!);
    params.append("message", message);
    params.append("sender", "KycQcellVerification");
    params.append("numbers", formattedNumber);
    params.append("test", TEST);

    console.log(process.env.SENDER!);

    const response = await fetch("https://api.txtlocal.com/send/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    console.log({ data, formattedNumber, otp });
  } catch (error) {
    console.log(error);
  }
}
