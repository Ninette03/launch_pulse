async function handler({ draft }, context) {
    const userId = context.user?.id;
  
    if (!userId) {
      return { error: "Authentication required" };
    }
  
    try {
      let evaluations;
  
      if (draft !== undefined) {
        evaluations = await sql(
          "SELECT * FROM evaluations WHERE created_by = $1 AND draft = $2 ORDER BY created_at DESC",
          [userId, draft]
        );
      } else {
        evaluations = await sql(
          "SELECT * FROM evaluations WHERE created_by = $1 ORDER BY created_at DESC",
          [userId]
        );
      }
  
      return { evaluations };
    } catch (error) {
      return { error: "Failed to fetch evaluations" };
    }
  }