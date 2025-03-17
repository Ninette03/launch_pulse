async function handler({ user }) {
    if (!user) {
      return { error: "Authentication required" };
    }
  
    try {
      const [stats] = await sql`
        SELECT 
          COUNT(DISTINCT l.id) as total_lessons,
          COUNT(DISTINCT CASE WHEN up.completed = true THEN l.id END) as completed_lessons,
          COUNT(DISTINCT CASE WHEN up.last_accessed IS NOT NULL AND up.completed = false THEN l.id END) as in_progress_lessons
        FROM lessons l
        LEFT JOIN user_progress up ON 
          l.id = up.lesson_id AND 
          up.user_id = ${user.id}
      `;
  
      const categoryProgress = await sql`
        SELECT 
          l.category,
          COUNT(DISTINCT l.id) as total,
          COUNT(DISTINCT CASE WHEN up.completed = true THEN l.id END) as completed
        FROM lessons l
        LEFT JOIN user_progress up ON 
          l.id = up.lesson_id AND 
          up.user_id = ${user.id}
        GROUP BY l.category
      `;
  
      const recentActivity = await sql`
        SELECT 
          l.title,
          l.category,
          up.completed,
          up.last_accessed
        FROM user_progress up
        JOIN lessons l ON up.lesson_id = l.id
        WHERE up.user_id = ${user.id}
        ORDER BY up.last_accessed DESC
        LIMIT 5
      `;
  
      return {
        stats,
        categoryProgress,
        recentActivity,
      };
    } catch (error) {
      return { error: "Failed to fetch progress statistics" };
    }
  }