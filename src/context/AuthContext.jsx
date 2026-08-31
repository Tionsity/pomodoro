import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    async function checkLogin() {
      const response = await fetch("http://localhost:3001/api/me", {
        credentials: "include",
      });

      const data = await response.json();

      setLoggedIn(data.loggedIn);
      setUsername(data.user);
    }

    checkLogin();
  }, []);

  async function handleLogout() {
    const response = await fetch("http://localhost:3001/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ loggedIn, username, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
