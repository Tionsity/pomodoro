import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const { loggedIn } = useContext(AuthContext);
  let mainArea;

  async function showProjects() {
    const response = await fetch("http://localhost:3001/api/projects", {
      credentials: "include",
    });
    const data = await response.json();
    setProjects(data);
  }

  useEffect(() => {
    showProjects();
  }, []);

  const projectList = projects.map((project) => {
    return (
      <div className="projectCard" key={project._id}>
        <p>{project.name}</p>
        <div className="projectButtons">
          <Link className="journalLink" to="/journal">
            ✎
          </Link>
          <button>⚙</button>
        </div>
      </div>
    );
  });

  if (loggedIn === true) {
    mainArea = (
      <div className="projectSelector">
        <div className="projectCard">+</div>
        {projectList}
      </div>
    );
  } else {
    mainArea = <div>Placeholder for not log in, mkay?</div>;
  }

  return (
    <>
      <h1>This is da dashboard</h1>
      <br />
      {mainArea}
      <br />
    </>
  );
}
