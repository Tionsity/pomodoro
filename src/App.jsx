import { useState } from "react";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import Register from "./components/register.jsx";
import Login from "./components/login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { Project } from "./pages/Project.jsx";
import { Journal } from "./pages/Journal.jsx";
import { TopBar } from "./components/topbar.jsx";
import { Layout } from "./components/layout.jsx";
function App() {
  return (
    <Routes>
      <Route
        element={
          <>
            <Layout></Layout>
          </>
        }>
        <Route
          path="/"
          element={
            <>
              <Dashboard></Dashboard>
            </>
          }
        />
        <Route
          path="/project"
          element={
            <>
              <Project></Project>
            </>
          }
        />
        <Route
          path="/journal"
          element={
            <>
              <Journal></Journal>
            </>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
