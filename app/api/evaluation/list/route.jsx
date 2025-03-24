async function handler({ evaluationId }) {
  try {
    const session = getSession();
    if (!session?.user?.id) {
      return { error: "Authentication required" };
    }

    if (!evaluationId) {
      return { error: "Evaluation ID is required" };
    }

    const [evaluation] = await sql`
      SELECT e.*, u.email 
      FROM evaluations e
      JOIN users u ON e.created_by = u.id
      WHERE e.id = ${evaluationId}
    `;

    if (!evaluation) {
      return { error: "Evaluation not found" };
    }

    const geminiResponse = await fetch("/integrations/google-gemini-1-5/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: `Analyze this business:
            Name: ${evaluation.business_name}
            Sector: ${evaluation.sector}
            Location: ${evaluation.location}
            Employees: ${evaluation.employees}
            Revenue Range: ${evaluation.revenue_range}
            Market Strategy: ${evaluation.market_strategy}
            Competitors: ${evaluation.competitors}
            Challenges: ${evaluation.challenges}

            Please provide:
            1. Market Score (0-100)
            2. Feasibility Score (0-100)
            3. Innovation Score (0-100)
            4. Detailed feedback`,
          },
        ],
      }),
    });

    if (!geminiResponse.ok) {
      throw new Error("Failed to get AI analysis");
    }

    const analysis = await geminiResponse.json();
    const content = analysis.choices[0].message.content;

    if (!content) {
      throw new Error("Invalid AI response format");
    }

    const scores = {
      market_score: parseInt(
        content.match(/Market Score.*?(\d+)/)?.[1] || "70"
      ),
      feasibility_score: parseInt(
        content.match(/Feasibility Score.*?(\d+)/)?.[1] || "70"
      ),
      innovation_score: parseInt(
        content.match(/Innovation Score.*?(\d+)/)?.[1] || "70"
      ),
    };

    await sql`
      UPDATE evaluations 
      SET 
        market_score = ${scores.market_score},
        feasibility_score = ${scores.feasibility_score},
        innovation_score = ${scores.innovation_score},
        feedback = ${content},
        draft = false
      WHERE id = ${evaluationId}
    `;

    const emailResponse = await fetch(process.env.EMAIL_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.EMAIL_SERVICE_API_KEY}`,
      },
      body: JSON.stringify({
        to: evaluation.email,
        subject: "Your Business Evaluation is Ready",
        text: `Your evaluation for ${evaluation.business_name} has been completed. Log in to view the detailed results.`,
      }),
    });

    if (!emailResponse.ok) {
      console.error("Failed to send email notification");
    }

    return {
      success: true,
      scores,
      feedback: content,
    };
  } catch (error) {
    console.error("Error processing evaluation:", error);
    return {
      error: "Failed to process evaluation",
      details: error.message,
    };
  }
}