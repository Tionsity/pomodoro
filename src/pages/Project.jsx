import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { update } from "../helpers/update.js";
import Timer from "../components/timer";

const data = await update(null, "GET", "projects");

export function Project() {
  const { name, id } = useParams();
  const currentProject = data.find((project) => project._id === id);
  let [milestoneData, setMilestoneData] = useState();
  async function getId() {
    setMilestoneData(await update(null, "GET", `milestones/${id}`));
  }
  useEffect(() => {
    getId();
  }, []);
  return (
    <>
      <h1>{currentProject.name}</h1>
      <p>Description: {currentProject.description}</p>
      {milestoneData?.title !== undefined && (
        <p>Current milestone: {milestoneData.title}</p>
      )}
      <br />
      <Timer></Timer>
      <br />
      <Link to="/">Get back</Link>
    </>
  );
}
