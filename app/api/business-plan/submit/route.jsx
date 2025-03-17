async function handler({ body }) {
    const session = getSession();
    if (!session?.user) {
      return { error: "Authentication required" };
    }
  
    if (!body?.businessName || !body?.description || !body?.sector) {
      return { error: "Missing required fields" };
    }
  
    try {
      const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a business plan evaluator. Analyze the business plan and provide a viability score (0-100) and detailed feedback.",
            },
            {
              role: "user",
              content: `Business Name: ${body.businessName}
                Description: ${body.description}
                Sector: ${body.sector}
                Target Market: ${body.targetMarket}
                Revenue Model: ${body.revenueModel}
                Competitors: ${body.competitors}
                Strengths: ${body.strengths}
                Weaknesses: ${body.weaknesses}`,
            },
          ],
          json_schema: {
            name: "business_evaluation",
            schema: {
              type: "object",
              properties: {
                viability_score: { type: "integer" },
                feedback: { type: "string" },
              },
              required: ["viability_score", "feedback"],
              additionalProperties: false,
            },
          },
        }),
      });
  
      const evaluation = JSON.parse(
        (await response.json()).choices[0].message.content
      );
  
      const [plan] = await sql`
        INSERT INTO business_plans (
          user_id,
          business_name,
          business_description,
          sector,
          target_market,
          revenue_model,
          competitors,
          strengths,
          weaknesses,
          viability_score,
          feedback
        ) VALUES (
          ${session.user.id},
          ${body.businessName},
          ${body.description},
          ${body.sector},
          ${body.targetMarket},
          ${body.revenueModel},
          ${body.competitors},
          ${body.strengths},
          ${body.weaknesses},
          ${evaluation.viability_score},
          ${evaluation.feedback}
        )
        RETURNING *`;
  
      return { success: true, plan };
    } catch (error) {
      return { error: "Failed to submit business plan" };
    }
  }