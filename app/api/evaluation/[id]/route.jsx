async function handler({ id }, context) {
    const userId = context.user?.id;
  
    if (!userId) {
      return { error: "Authentication required" };
    }
  
    try {
      const [evaluation] = await sql`
        SELECT * FROM evaluations 
        WHERE id = ${id} 
        AND created_by = ${userId}
      `;
  
      if (!evaluation) {
        return { error: "Evaluation not found or unauthorized" };
      }
  
      return { evaluation };
    } catch (error) {
      return { error: "Failed to fetch evaluation" };
    }
  }