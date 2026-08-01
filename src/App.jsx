import { useState } from "react";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import Meddelande from "./components/timer";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";

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
            {loggedIn && <h2>Ya logged in!</h2>}
            <Meddelande />
            <br />
            <a href="/pomodoro/register">Register</a>
            <br />
            {loggedIn === false && <a href="/pomodoro/login">Log in</a>}
            {loggedIn && <button onClick={handleLogout}>Log it on out!</button>}
          </>
        }
      />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
