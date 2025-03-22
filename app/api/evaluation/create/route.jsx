import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      businessName,
      sector,
      location,
      employees,
      revenue,
      marketStrategy,
      competitors,
      challenges,
      draft,
    } = body;

    try {
      const [evaluation] = await sql`
        INSERT INTO Evaluation (
          business_name,
          sector,
          location,
          employees,
          revenue_range,
          market_strategy,
          competitors,
          challenges,
          draft,
          market_score,
          feasibility_score,
          innovation_score
        ) VALUES (
          ${businessName || null},
          ${sector || null},
          ${location || null},
          ${employees || null},
          ${revenue || null},
          ${marketStrategy || null},
          ${competitors || null},
          ${challenges || null},
          ${draft},
          ${calculateMarketScore({ sector, marketStrategy })},
          ${calculateFeasibilityScore({ employees, revenue })},
          ${calculateInnovationScore({ competitors, challenges })}
        )
        RETURNING *
      `;

      return NextResponse.json({ evaluation });
    } catch (error) {
      console.error('Database error:', error.message);
      return NextResponse.json(
        { error: "Failed to create evaluation", details: error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
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