// app/api/business-plan/analyze/route.js
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { businessData } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Analyze this business plan in one paragraph: ${JSON.stringify(businessData)}`;
    
    const result = await model.generateContent(prompt);
    const analysis = (await result.response).text();

    return NextResponse.json({ analysis });

  } catch (error) {
    return NextResponse.json(
      { error: "Analysis failed - try again later" },
      { status: 500 }
    );
  }
}