async function handler({ user, lessonId }) {
    if (!user) {
      return { error: "Authentication required" };
    }
  
    try {
      const [lesson] = await sql`
        SELECT * FROM lessons WHERE id = ${lessonId}
      `;
  
      if (!lesson) {
        return { error: "Lesson not found" };
      }
  
      const [progress] = await sql`
        SELECT 
          COUNT(DISTINCT CASE WHEN completed = true THEN lesson_id END) as completed_count,
          COUNT(DISTINCT lesson_id) as total_count
        FROM user_progress 
        WHERE user_id = ${user.id}
      `;
  
      const [nextLesson] = await sql`
        SELECT l.* 
        FROM lessons l
        LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = ${user.id}
        WHERE up.completed IS NULL OR up.completed = false
        ORDER BY l.order_number
        LIMIT 1
      `;
  
      const progressPercentage = Math.round(
        (progress.completed_count / progress.total_count) * 100
      );
  
      await fetch(process.env.EMAIL_SERVICE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.email,
          subject: `Congratulations on completing ${lesson.title}!`,
          text: `Great job completing ${
            lesson.title
          }!\n\nYour current progress: ${progressPercentage}%\n\n${
            nextLesson
              ? `Ready for your next lesson? Check out: ${nextLesson.title}`
              : "You've completed all lessons!"
          }\n\nKeep up the great work!`,
        }),
      });
  
      await sql`
        INSERT INTO reminder_logs (user_id, type)
        VALUES (${user.id}, 'progress_email')
      `;
  
      return { success: true };
    } catch (error) {
      return { error: "Failed to send progress notification" };
    }
  }