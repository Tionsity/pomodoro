import { useState } from "react";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import Meddelande from "./components/timer";
import Register from "./components/register.jsx";
import Login from "./components/login.jsx";
import accountCard from "./components/accountCard.jsx";
import AccountCard from "./components/accountCard.jsx";

function App() {
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    async function checkLogin() {
      const response = await fetch("http://localhost:3001/api/me", {
        credentials: "include",
      });

      const data = await response.json();

      setLoggedIn(data.loggedIn);
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
    <Routes>
      <Route
        path="/"
        element={
          <>
            <h1>Pomodoro</h1>
            <Meddelande />
            <br />
            <AccountCard></AccountCard>
            <br />
          </>
        }
      />
    </Routes>
  );
}

export default App;
