import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulating user authentication check
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  return {
    user,
    login: (userData) => {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    },
    logout: () => {
      localStorage.removeItem("user");
      setUser(null);
    },
  };
};
