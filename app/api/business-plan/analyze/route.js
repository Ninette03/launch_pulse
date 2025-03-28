// app/api/business-plan/analyze/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeBusinessPlan(businessData) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const prompt = `
      Analyze this business plan and provide structured feedback:
      
      **Business Overview**:
      - Name: ${businessData.businessName}
      - Industry: ${businessData.industry}
      - Stage: ${businessData.stage}
      
      **Key Metrics**:
      - Target Market: ${businessData.targetMarket}
      - Revenue Model: ${businessData.revenueModel}
      - Competitive Advantage: ${businessData.competitiveAdvantage}
      
      Provide analysis in this format:
      1. Market Potential (1-10 rating)
      2. Feasibility (1-10 rating)
      3. Innovation Score (1-10 rating)
      4. Top 3 Strengths
      5. Top 3 Risks
      6. Specific Recommendations
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the AI response into structured JSON
    return parseAnalysisResponse(text);
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw new Error('Failed to analyze business plan');
  }
}

function parseAnalysisResponse(text) {
  // Extract scores using regex
  const marketMatch = text.match(/Market Potential.*?(\d+)/);
  const feasibilityMatch = text.match(/Feasibility.*?(\d+)/);
  const innovationMatch = text.match(/Innovation Score.*?(\d+)/);

  // Extract lists
  const strengths = extractListItems(text, /Strengths.*?\n(.*?)(?=\n\d\.|\n\*\*|$)/s);
  const risks = extractListItems(text, /Risks.*?\n(.*?)(?=\n\d\.|\n\*\*|$)/s);
  const recommendations = extractListItems(text, /Recommendations.*?\n(.*?)(?=\n\d\.|\n\*\*|$)/s);

  return {
    scores: {
      market: marketMatch ? parseInt(marketMatch[1]) : 0,
      feasibility: feasibilityMatch ? parseInt(feasibilityMatch[1]) : 0,
      innovation: innovationMatch ? parseInt(innovationMatch[1]) : 0,
    },
    strengths,
    risks,
    recommendations,
    rawAnalysis: text
  };
}

function extractListItems(text, regex) {
  const match = text.match(regex);
  if (!match) return [];
  
  return match[1]
    .split('\n')
    .map(item => item.replace(/^[-\*•]\s*/, '').trim())
    .filter(item => item.length > 0);
}

export async function POST(request) {
  try {
    // Authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    // Get and validate input
    const businessData = await request.json();
    if (!businessData.businessName || !businessData.industry) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Perform analysis
    const analysis = await analyzeBusinessPlan(businessData);

    // Return results
    return NextResponse.json(analysis, { status: 200 });

  } catch (error) {
    console.error('Analysis endpoint error:', error);
    return NextResponse.json(
      { error: error.message || "Analysis failed" },
      { status: 500 }
    );
  }
}