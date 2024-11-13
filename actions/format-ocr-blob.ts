"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface OutputFormat {
  title: string;
  firstName: string;
  middleName: string;
  height: string;
  dateOfBirth: string;
  expiryDate: string;
  personalIdNumber: string;
}

const outputFormat: OutputFormat = {
  title: "",
  firstName: "",
  middleName: "",
  height: "",
  dateOfBirth: "",
  expiryDate: "",
  personalIdNumber: "",
};

const numRetries = 5;
const modelTimeout = 5000; // Timeout for model call in ms

const cleanResponse = (content: string) => {
  return content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

const callModelWithTimeout = async (prompt: string, timeout: number) => {
  return Promise.race([
    model.generateContent(prompt),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Model call timed out")), timeout)
    ),
  ]);
};

export async function OCRAIFormatter({ dataInput }: { dataInput: any }) {
  console.log("dataInput", dataInput);
  try {
    const prompt = `
      Given the following data, extract only the fields: 
      "title", "firstName", "middleName", "height", "dateOfBirth: 2024-11-06", "expiryDate", and "personalIdNumber". 
      Respond in valid JSON format with only these fields. Ensure JSON validity.
    the date of birth should be in this format  2024-11-06


      Input data:
      ${JSON.stringify(dataInput)}
    `;

    for (let attempt = 0; attempt < numRetries; attempt++) {
      try {
        const result: any = await callModelWithTimeout(prompt, modelTimeout);

        const assistantContent =
          result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        if (!assistantContent) {
          throw new Error("No response from the AI model.");
        }

        const cleanedContent = cleanResponse(assistantContent);
        const parsedOutput: OutputFormat = JSON.parse(cleanedContent);

        const keysAreValid = Object.keys(outputFormat).every(
          (key) => key in parsedOutput
        );

        if (keysAreValid) {
          return { success: true, data: parsedOutput };
        } else {
          console.warn("Missing keys in JSON output:", parsedOutput);
          throw new Error("Incomplete JSON keys");
        }
      } catch (error: any) {
        console.log(`Attempt ${attempt + 1} failed. Retrying...`);
        console.log("Error:", error.message);
      }
    }

    throw new Error(
      "Failed to generate valid JSON response after multiple attempts."
    );
  } catch (error) {
    console.error("Error generating response:", error);
    return {
      success: false,
      data: outputFormat, // Return empty OutputFormat structure
      error: "Failed to generate response. Please try again.",
    };
  }
}
