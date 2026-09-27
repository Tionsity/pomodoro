import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { update } from "../helpers/update.js";
import { DashboardSettingsCard } from "../components/dashboardSettingsCard.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const { loggedIn } = useContext(AuthContext);
  let mainArea;

  async function showProjects() {
    const showData = await update(null, "GET", "projects");
    setProjects(showData);
  }

  useEffect(() => {
    showProjects();
  }, []);

  let settingsStart = false;
  let [settings, setSettings] = useState(settingsStart);

  let showProjectStart = {};
  let [showProject, setShowProject] = useState(showProjectStart);

  let currentProjectChange;

  const projectList = projects.map((project) => {
    return (
      <div
        className="projectCard"
        id={project._id}
        key={project._id}
        style={{ backgroundColor: project.color }}>
        <p>{project.name}</p>
        <div className="projectButtons">
          <Link className="journalLink" to="/journal">
            ✎
          </Link>
          <button
            className={project._id}
            onClick={async () => {
              if (!settings) {
                setShowProject(project);
                setSettings(true);
              } else {
                setSettings(false);
              }
              console.log(settings);
            }}>
            ⚙
          </button>
          {settings && project._id === showProject._id && (
            <DashboardSettingsCard {...showProject} />
          )}
        </div>
      </div>
    );
  });

  if (loggedIn === true) {
    mainArea = (
      <div className="projectSelector">
        <div
          className="projectCard newProject"
          onClick={() => navigate("/newProject")}>
          +
        </div>
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
