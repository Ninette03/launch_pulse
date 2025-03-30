import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.businessName || !body.description || !body.sector) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Call OpenAI (replace with correct API URL)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Ensure this is set in your .env
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a business plan evaluator. Analyze the business plan and provide a viability score (0-100) and detailed feedback.",
          },
          {
            role: "user",
            content: `Business Name: ${body.businessName}
              Description: ${body.description}
              Sector: ${body.sector}
              Target Market: ${body.targetMarket}
              Revenue Model: ${body.revenueModel}
              Competitors: ${body.competitors}
              Strengths: ${body.strengths}
              Weaknesses: ${body.weaknesses}`,
          },
        ],
      }),
    });

    const responseData = await response.json();
    const evaluation = JSON.parse(responseData.choices[0].message.content);

    // Save business plan to Prisma database
    const plan = await prisma.businessPlan.create({
      data: {
        userId: session.user.id,
        businessName: body.businessName,
        description: body.description,
        sector: body.sector,
        targetMarket: body.targetMarket,
        revenueModel: body.revenueModel,
        competitors: body.competitors,
        strengths: body.strengths,
        weaknesses: body.weaknesses,
        viabilityScore: evaluation.viability_score,
        feedback: evaluation.feedback,
      },
    });

    return NextResponse.json({ success: true, plan }, { status: 201 });
  } catch (error) {
    console.error("Failed to submit business plan:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
