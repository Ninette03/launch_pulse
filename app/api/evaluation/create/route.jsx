import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request) {
  
  try {
    const body = await request.json();
    const {
      businessName,
      sector,
      employees,
      revenue,
      marketStrategy,
      competitors,
      challenges,
      draft,
    } = body;

    const evaluation = await prisma.evaluation.create({
      data: {
        businessName: businessName,
        sector,
        employees,
        revenue: revenue,
        marketStrategy: marketStrategy,
        competitors,
        challenges,
        draft,
        market_score: calculateMarketScore({ sector, marketStrategy }),
        feasibility_score: calculateFeasibilityScore({ employees, revenue }),
        innovation_score: calculateInnovationScore({ competitors, challenges }),
      },
    });

    return NextResponse.json({ evaluation });
  } catch (error) {
    console.error('Database error:', error.message);
    return NextResponse.json(
      { error: "Failed to create evaluation", details: error.message },
      { status: 500 }
    );
  }
}

function calculateMarketScore({ sector, marketStrategy }) {
  let score = 0;
  if (sector) score += 15;
  if (marketStrategy?.length > 100) score += 15;
  return score;
}

function calculateFeasibilityScore({ employees, revenue }) {
  let score = 0;
  if (employees) score += 15;
  if (revenue) score += 15;
  return score;
}

function calculateInnovationScore({ competitors, challenges }) {
  let score = 0;
  if (competitors?.length > 100) score += 20;
  if (challenges?.length > 100) score += 20;
  return score;
}