import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      id,
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

    const updates = [];
    const values = [];
    let valueCount = 1;

    if (businessName !== undefined) {
      updates.push(`business_name = $${valueCount}`);
      values.push(businessName);
      valueCount++;
    }
    if (sector !== undefined) {
      updates.push(`sector = $${valueCount}`);
      values.push(sector);
      valueCount++;
    }
    if (location !== undefined) {
      updates.push(`location = $${valueCount}`);
      values.push(location);
      valueCount++;
    }
    if (employees !== undefined) {
      updates.push(`employees = $${valueCount}`);
      values.push(employees);
      valueCount++;
    }
    if (revenue !== undefined) {
      updates.push(`revenue_range = $${valueCount}`);
      values.push(revenue);
      valueCount++;
    }
    if (marketStrategy !== undefined) {
      updates.push(`market_strategy = $${valueCount}`);
      values.push(marketStrategy);
      valueCount++;
    }
    if (competitors !== undefined) {
      updates.push(`competitors = $${valueCount}`);
      values.push(competitors);
      valueCount++;
    }
    if (challenges !== undefined) {
      updates.push(`challenges = $${valueCount}`);
      values.push(challenges);
      valueCount++;
    }
    if (draft !== undefined) {
      updates.push(`draft = $${valueCount}`);
      values.push(draft);
      valueCount++;
    }

    if (sector !== undefined || marketStrategy !== undefined) {
      updates.push(`market_score = $${valueCount}`);
      values.push(calculateMarketScore({ sector, marketStrategy }));
      valueCount++;
    }
    if (employees !== undefined || revenue !== undefined) {
      updates.push(`feasibility_score = $${valueCount}`);
      values.push(calculateFeasibilityScore({ employees, revenue }));
      valueCount++;
    }
    if (competitors !== undefined || challenges !== undefined) {
      updates.push(`innovation_score = $${valueCount}`);
      values.push(calculateInnovationScore({ competitors, challenges }));
      valueCount++;
    }

    values.push(id);

    try {
      const [evaluation] = await sql`
        UPDATE Evaluation 
        SET ${sql(updates.join(", "))}
        WHERE id = ${id}
        RETURNING *
      `;

      if (!evaluation) {
        return NextResponse.json(
          { error: "Evaluation not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ evaluation });
    } catch (error) {
      console.error('Update error:', error);
      return NextResponse.json(
        { error: "Failed to update evaluation" },
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