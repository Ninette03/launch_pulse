async function handler({ body }) {
    if (!body?.email || !body?.password) {
      return { error: "Missing required fields" };
    }
  
    try {
      const [user] = await sql`
        SELECT id, username, email, password_hash, preferred_language
        FROM users 
        WHERE email = ${body.email}
      `;
  
      if (!user) {
        return { error: "Invalid email or password" };
      }
  
      const [salt, storedHash] = user.password_hash.split(":");
      const hash = crypto
        .pbkdf2Sync(body.password, salt, 1000, 64, "sha512")
        .toString("hex");
  
      if (storedHash !== hash) {
        return { error: "Invalid email or password" };
      }
  
      const token = crypto.randomBytes(32).toString("hex");
      await sql`
        UPDATE users 
        SET session_token = ${token},
            session_expiry = ${new Date(Date.now() + 24 * 60 * 60 * 1000)}
        WHERE id = ${user.id}
      `;
  
      delete user.password_hash;
      return { user, token };
    } catch (error) {
      return { error: "Login failed" };
    }
  }