async function handler(
    {
      businessName,
      sector,
      location,
      employees,
      revenue,
      marketStrategy,
      competitors,
      challenges,
      draft = true,
    },
    context
  ) {
    const userId = context.user?.id;
  
    if (!userId) {
      return { error: "Authentication required" };
    }
  
    const marketScore = calculateMarketScore({ sector, marketStrategy });
    const feasibilityScore = calculateFeasibilityScore({ employees, revenue });
    const innovationScore = calculateInnovationScore({ competitors, challenges });
  
    try {
      const [evaluation] = await sql`
        INSERT INTO evaluations (
          business_name,
          sector,
          location, 
          employees,
          revenue_range,
          market_strategy,
          competitors,
          challenges,
          draft,
          created_by,
          market_score,
          feasibility_score,
          innovation_score
        ) VALUES (
          ${businessName},
          ${sector},
          ${location},
          ${employees},
          ${revenue},
          ${marketStrategy},
          ${competitors},
          ${challenges},
          ${draft},
          ${userId},
          ${marketScore},
          ${feasibilityScore},
          ${innovationScore}
        )
        RETURNING *
      `;
  
      return { evaluation };
    } catch (error) {
      return { error: "Failed to create evaluation" };
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