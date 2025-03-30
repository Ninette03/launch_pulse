import { NextResponse } from "next/server";
import { auth } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    // Fetch the latest evaluation created by the user
    const evaluation = await prisma.evaluation.findFirst({
      where: { businessName: { not: null } },
      orderBy: { created_at: "desc" },
    });

    if (!evaluation) {
      return NextResponse.json({ error: "No evaluation found" }, { status: 404 });
    }

    // Format the content for the PDF
    const content = `
      # Business Evaluation Report: ${evaluation.businessName}
      
      ## Sector
      ${evaluation.sector}

      ## Market Strategy
      ${evaluation.marketStrategy || "Not provided"}

      ## Competitor Analysis
      ${evaluation.competitors || "Not provided"}

      ## Business Challenges
      ${evaluation.challenges || "Not provided"}

      ## Team & Employees
      ${evaluation.employees || "Not provided"}

      ## Revenue Model
      ${evaluation.revenue || "Not provided"}

      ## SWOT Analysis
      - **Strengths:** ${evaluation.feedback || "No feedback available"}
      
      ## Evaluation Scores
      - **Market Score:** ${evaluation.market_score}/100
      - **Feasibility Score:** ${evaluation.feasibility_score}/100
      - **Innovation Score:** ${evaluation.innovation_score}/100
      
      **Generated on:** ${new Date().toLocaleDateString()}
    `;

    return NextResponse.json({
      content,
      filename: `${evaluation.businessName.toLowerCase().replace(/\s+/g, "-")}-evaluation-report.pdf`,
    });

  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
};