async function handler({ method, path, body }) {
    if (!path) {
      return { error: "Invalid path" };
    }
  
    const authPath = path.replace("/api/auth/", "");
  
    switch (`${method} ${authPath}`) {
      case "POST register":
        if (!body?.email || !body?.password || !body?.username) {
          return { error: "Missing required fields" };
        }
  
        try {
          const existingUser = await sql`
            SELECT id FROM users 
            WHERE email = ${body.email} OR username = ${body.username}
          `;
  
          if (existingUser.length > 0) {
            return { error: "User already exists" };
          }
  
          const salt = crypto.randomBytes(16).toString("hex");
          const hash = crypto
            .pbkdf2Sync(body.password, salt, 1000, 64, "sha512")
            .toString("hex");
  
          const [user] = await sql`
            INSERT INTO users (username, email, password_hash)
            VALUES (${body.username}, ${body.email}, ${`${salt}:${hash}`})
            RETURNING id, username, email, preferred_language
          `;
  
          return { user };
        } catch (error) {
          return { error: "Registration failed" };
        }
  
      case "POST login":
        if (!body?.email || !body?.password) {
          return { error: "Missing credentials" };
        }
  
        try {
          const [user] = await sql`
            SELECT id, username, email, password_hash, preferred_language
            FROM users 
            WHERE email = ${body.email}
          `;
  
          if (!user) {
            return { error: "Invalid credentials" };
          }
  
          const [salt, storedHash] = user.password_hash.split(":");
          const hash = crypto
            .pbkdf2Sync(body.password, salt, 1000, 64, "sha512")
            .toString("hex");
  
          if (storedHash !== hash) {
            return { error: "Invalid credentials" };
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
  
      case "POST reset-password":
        if (!body?.email) {
          return { error: "Email required" };
        }
  
        try {
          const [user] = await sql`
            SELECT id FROM users WHERE email = ${body.email}
          `;
  
          if (!user) {
            return { error: "User not found" };
          }
  
          const resetToken = crypto.randomBytes(32).toString("hex");
          const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
  
          await sql`
            UPDATE users 
            SET reset_token = ${resetToken},
                reset_token_expiry = ${tokenExpiry}
            WHERE id = ${user.id}
          `;
  
          return { message: "Password reset email sent" };
        } catch (error) {
          return { error: "Password reset request failed" };
        }
  
      case "GET validate":
        const token = body?.token;
        if (!token) {
          return { error: "No token provided" };
        }
  
        try {
          const [user] = await sql`
            SELECT id, username, email, preferred_language
            FROM users 
            WHERE session_token = ${token}
            AND session_expiry > ${new Date()}
          `;
  
          if (!user) {
            return { error: "Invalid or expired session" };
          }
  
          return { user };
        } catch (error) {
          return { error: "Session validation failed" };
        }
  
      case "POST logout":
        const logoutToken = body?.token;
        if (!logoutToken) {
          return { error: "No token provided" };
        }
  
        try {
          await sql`
            UPDATE users 
            SET session_token = NULL,
                session_expiry = NULL
            WHERE session_token = ${logoutToken}
          `;
  
          return { message: "Logged out successfully" };
        } catch (error) {
          return { error: "Logout failed" };
        }
  
      default:
        return { error: "Invalid endpoint" };
    }
  }