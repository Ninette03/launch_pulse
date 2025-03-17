async function handler({ email }) {
    if (!email) {
      return { error: "Email is required" };
    }
  
    try {
      const [user] = await sql`
        SELECT id, email 
        FROM users 
        WHERE email = ${email}
      `;
  
      if (!user) {
        return {
          message:
            "If an account exists with this email, a reset link will be sent",
        };
      }
  
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
      await sql`
        UPDATE users 
        SET reset_token = ${resetToken},
            reset_token_expires = ${resetTokenExpires}
        WHERE id = ${user.id}
      `;
  
      return {
        message:
          "If an account exists with this email, a reset link will be sent",
        token: resetToken,
      };
    } catch (error) {
      return { error: "An error occurred processing your request" };
    }
  }