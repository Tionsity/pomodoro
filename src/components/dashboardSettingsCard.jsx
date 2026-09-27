import { useState } from "react";
import { colorPalette } from "../helpers/colorPalette.jsx";
import { update } from "../helpers/update.js";

export function DashboardSettingsCard(project) {
  let [changedName, setChangedName] = useState(project.name);
  let [changedDescription, setChangedDescription] = useState(
    project.description,
  );
  let [changedNumberofPomodoros, setChangedNumberofPomodoros] = useState(
    project.numberOfPomodoros,
  );
  let [changedColor, setChangedColor] = useState(project.color);

  let changedValues = {};

  let [deleteStep, setDeleteStep] = useState("ask");

  let card = (
    <div className="dashboardSettingsCard">
      {deleteStep === "ask" && (
        <form action="">
          <label htmlFor="">Title</label>
          <input
            type="text"
            value={changedName}
            onChange={(event) => setChangedName(event.target.value)}
          />
          <label htmlFor="">Description</label>
          <input
            type="text"
            value={changedDescription}
            onChange={(event) => setChangedDescription(event.target.value)}
          />
          <br />
          <label htmlFor="">Color</label>
          {colorPalette(setChangedColor)}
          <br />
          <label htmlFor="">Number of Pomodoros</label>
          <input
            type="number"
            value={changedNumberofPomodoros}
            onChange={(event) =>
              setChangedNumberofPomodoros(event.target.value)
            }
          />
          <button
            type="button"
            onClick={async () => {
              changedValues = {
                newTitle: changedName,
                newDescription: changedDescription,
                newColor: changedColor,
                NewNumberOfPomodoros: changedNumberofPomodoros,
                currentProject: project,
              };
              await update(changedValues, "PATCH", "projects");
              location.reload();
            }}>
            Submit
          </button>
          <br />

          <button
            className="projectDelete"
            onClick={() => {
              setDeleteStep("confirm");
            }}>
            Delete Project
          </button>
        </form>
      )}
      {deleteStep === "confirm" && (
        <>
          <h2>You sure about that?</h2>
          <button
            className="projectDelete"
            onClick={async () => {
              changedValues = {
                currentProject: project,
              };
              await update(changedValues, "DELETE", "projects");
              location.reload();
            }}>
            Yes
          </button>
        </>
      )}
    </div>
  );

  return <>{card} </>;
}
