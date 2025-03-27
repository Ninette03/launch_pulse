async function handler({ lessonId, completed }) {
    const session = getSession();
    if (!session?.user?.id) {
      return { error: "Authentication required" };
    }
  
    if (!lessonId) {
      return { error: "Lesson ID is required" };
    }
  
    try {
      await sql`
        INSERT INTO user_progress (user_id, lesson_id, completed, last_accessed)
        VALUES (${session.user.id}, ${lessonId}, ${completed}, NOW())
        ON CONFLICT (user_id, lesson_id)
        DO UPDATE SET 
          completed = ${completed},
          last_accessed = NOW()
      `;
  
      return { success: true };
    } catch (error) {
      return { error: "Failed to update progress" };
    }
  }