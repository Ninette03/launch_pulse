async function handler({ id }) {
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
  
      return { plan };
    } catch (error) {
      return { error: "Failed to fetch business plan" };
    }
  }