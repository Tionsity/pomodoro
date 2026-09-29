import { useState } from "react";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./components/register.jsx";
import Login from "./components/login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { Project } from "./pages/Project.jsx";
import Journal from "./pages/Journal.jsx";
import { NewProject } from "./pages/newProjext.jsx";
import { TopBar } from "./components/topbar.jsx";
import { Layout } from "./components/layout.jsx";
import { update } from "./helpers/update.js";
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
          path="/journal"
          element={
            <>
              <Journal></Journal>
            </>
          }
        />
        <Route
          path="/newProject"
          element={
            <>
              <NewProject></NewProject>
            </>
          }
        />
      </Route>
      <Route
        path="/project/:id/:name"
        element={
          <>
            <Project></Project>
          </>
        }
      />
    </Routes>
  );
}

export default App;
