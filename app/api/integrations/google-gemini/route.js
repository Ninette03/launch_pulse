import { GoogleGenerativeAI } from "@google/generative-ai";
export async function POST(request) {
    try {
      // Get API key from environment variables
      const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
      
      if (!apiKey) {
        return NextResponse.json(
          { error: "Google Gemini API key not configured" },
          { status: 500 }
        );
      }
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent("Your prompt here");
      const response = await result.response;
      const text = response.text();
    } catch (error) {
        console.error("Google Gemini error:", error);
        return NextResponse.json(
          { error: "Failed to process request" },
          { status: 500 }
        );
      }
    }
