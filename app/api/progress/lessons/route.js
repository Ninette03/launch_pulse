async function handler() {
    const session = getSession();
    if (!session?.user?.id) {
      return { error: "Authentication required" };
    }
  
    try {
      const lessons = await sql`
        SELECT 
          l.*,
          COALESCE(up.completed, false) as completed,
          up.last_accessed
        FROM lessons l
        LEFT JOIN user_progress up ON 
          l.id = up.lesson_id AND 
          up.user_id = ${session.user.id}
        ORDER BY l.order_number ASC
      `;
  
      return { lessons };
    } catch (error) {
      return { error: "Failed to fetch lessons" };
    }
  }