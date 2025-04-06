// app/api/evaluation/get/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Missing evaluation ID" },
        { status: 400 }
      );
    }

    const evaluation = await prisma.evaluation.findUnique({
      where: { id },
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: "Evaluation not found" },
        { status: 404 }
      );
    }

    // Return in the exact format your frontend expects
    return NextResponse.json({
      id: evaluation.id,
      businessName: evaluation.businessName,
      sector: evaluation.sector,
      scores: {
        market: evaluation.market_score || 0,
        feasibility: evaluation.feasibility_score || 0,
        innovation: evaluation.innovation_score || 0,
      },
      feedback: "Evaluation loaded successfully" // Add any additional fields
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}