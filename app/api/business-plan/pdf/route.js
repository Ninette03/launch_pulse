import { NextResponse } from "next/server";
import { getSession } from "next-auth/react"; // Ensure you have next-auth configured
import { sql } from "@/lib/db"; // Adjust this to match your actual database connection

export async function GET() {
  const session = await getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const [plan] = await sql`
      SELECT * FROM business_plans 
      WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (!plan) {
      return NextResponse.json({ error: "No business plan found" }, { status: 404 });
    }

    const [evaluation] = await sql`
      SELECT * FROM evaluations
      WHERE business_idea_id = ${plan.id}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const content = `
      # Business Plan: ${plan.business_name}
      
      ## Executive Summary
      ${plan.business_description}
      
      ## Market Analysis
      Target Market: ${plan.target_market}
      
      ## Business Model
      Revenue Model: ${plan.revenue_model}
      
      ## Competitive Analysis
      ${plan.competitors}
      
      ## SWOT Analysis
      Strengths: ${plan.strengths}
      Weaknesses: ${plan.weaknesses}
      
      ## Expert Analysis
      ${evaluation ? evaluation.feedback : "No analysis available"}
      
      Overall Viability Score: ${evaluation ? evaluation.market_score : "N/A"}/100
      
      Generated on: ${new Date().toLocaleDateString()}
    `;

    return NextResponse.json({
      content,
      filename: `${plan.business_name.toLowerCase().replace(/\s+/g, "-")}-business-plan.pdf`,
    });

  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
