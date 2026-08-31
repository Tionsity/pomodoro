import { Link } from "react-router-dom";
import Timer from "../components/timer";

export function Project() {
  return (
    <>
      <h1>Yar be da project!</h1>
      <br />
      <Timer></Timer>
      <br />
      <Link to="/">Get back</Link>
    </>
  );
}
