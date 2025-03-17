async function handler({ body }) {
    const session = getSession();
    if (!session?.user?.id) {
      return { error: "Authentication required" };
    }
  }