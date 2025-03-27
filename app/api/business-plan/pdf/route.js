async function handler({ user }) {
    const session = getSession();
    if (!session?.user?.id) {
      return { error: "Authentication required" };
    }
  
    try {
      const [plan] = await sql`
        SELECT * FROM business_plans 
        WHERE user_id = ${session.user.id}
        ORDER BY created_at DESC
        LIMIT 1
      `;
  
      if (!plan) {
        return { error: "No business plan found" };
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
        
        Overall Viability Score: ${
          evaluation ? evaluation.market_score : "N/A"
        }/100
        
        Generated on: ${new Date().toLocaleDateString()}
      `;
  
      return {
        content,
        filename: `${plan.business_name
          .toLowerCase()
          .replace(/\s+/g, "-")}-business-plan.pdf`,
      };
    } catch (error) {
      return { error: "Failed to generate PDF" };
    }
  }