import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      id,
      businessName,
      sector,
      employees,
      revenue,
      marketStrategy,
      competitors,
      challenges,
      draft,
    } = body;

    // Prepare the data object for updates
    const data = {};
    
    if (businessName !== undefined) data.businessName = businessName;
    if (sector !== undefined) data.sector = sector;
    if (employees !== undefined) data.employees = employees;
    if (revenue !== undefined) data.revenue = revenue;
    if (marketStrategy !== undefined) data.marketStrategy = marketStrategy;
    if (competitors !== undefined) data.competitors = competitors;
    if (challenges !== undefined) data.challenges = challenges;
    if (draft !== undefined) data.draft = draft;

    // Calculate scores if necessary
    if (sector !== undefined || marketStrategy !== undefined) {
      data.market_score = calculateMarketScore({ sector, marketStrategy });
    }
    if (employees !== undefined || revenue !== undefined) {
      data.feasibility_score = calculateFeasibilityScore({ employees, revenue });
    }
    if (competitors !== undefined || challenges !== undefined) {
      data.innovation_score = calculateInnovationScore({ competitors, challenges });
    }

    // Update the evaluation in the database
    const evaluation = await prisma.evaluation.update({
      where: { id },
      data,
    });

    return NextResponse.json({ 
      evaluationId: evaluation.id,
      market_score: evaluation.market_score,
      feasibility_score: evaluation.feasibility_score,
      innovation_score: evaluation.innovation_score,
    });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: "Failed to update evaluation", details: error.message },
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