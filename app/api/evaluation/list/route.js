import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const evaluationId = searchParams.get("evaluationId");
    
    // 1. Fetch your evaluation data (your existing logic)
    const evaluation = await prisma.evaluation.findUnique({
      where: { id: evaluationId },
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: "Evaluation not found" },
        { status: 404 }
      );
    }

    // 2. Call Gemini ONLY if evaluation is ready for analysis
    if (!evaluation.draft && !evaluation.feedback) {
      const model = genAI.getGenerativeModel({
        model: process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-1.5-pro-latest"
      });

      const prompt = `
        Analyze this business evaluation and provide detailed feedback:
        
        - Business: ${evaluation.businessName}
        - Sector: ${evaluation.sector}
        - MarketScore: ${evaluation.market_score}/100
        - Feasibility Score: ${evaluation.feasibility_score}/100
        - Innovation Score: ${evaluation.innovation_score}/100
        
        Provide specific recommendations for improvement.
      `;

      const result = await model.generateContent(prompt);
      const feedback = (await result.response).text();
      const truncatedFeedback = feedback.slice(0, 5000);

      await prisma.evaluation.update({
        where: { id: evaluationId },
        data: { 
          feedback: truncatedFeedback,
        updated_at: new Date() },
      });
    }

    return NextResponse.json(
      await prisma.evaluation.findUnique({
        where: { id: evaluationId },
      })
    );

  } catch (error) {
    console.error("Gemini error details:", {
      message: error.message,
      stack:error.stack,
      cause: error.cause
    });
    return NextResponse.json(
      { error: "Analysis failed: " + error.message },
      { status: 500 }
    );
  }
}