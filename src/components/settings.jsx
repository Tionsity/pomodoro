import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function SettingsCard() {
  const { handleLogout } = useContext(AuthContext);

  const [accountSettingsOpen, setaccountSettingsOpen] = useState(false);
  const [pomodoroSettingsOpen, setpomodoroSettingsOpen] = useState(false);

  let settingsCard;

  if (accountSettingsOpen === true) {
    settingsCard = (
      <>
        <h2>Dis be da account settings</h2>
        <br />
        <p>Setting 1</p>
        <p>Setting 2</p>
        <p>Setting 3</p>
        <br />
        <button onClick={(event) => setaccountSettingsOpen(false)}>
          Save changes
        </button>
      </>
    );
  } else if (pomodoroSettingsOpen === true) {
    settingsCard = (
      <>
        <h2>Dis be da pomodoro settings</h2>
        <br />
        <p>Setting 1</p>
        <p>Setting 2</p>
        <p>Setting 3</p>
        <br />
        <button onClick={(event) => setpomodoroSettingsOpen(false)}>
          Save changes
        </button>
      </>
    );
  } else {
    settingsCard = (
      <>
        <h2>Dis be da settings </h2>
        <br />
        <form>
          <button onClick={(event) => setaccountSettingsOpen(true)}>
            Account settings
          </button>
          <br />
          <button onClick={(event) => setpomodoroSettingsOpen(true)}>
            Pomodoro settings
          </button>
          <br />
          <br />
          <br />
          <button onClick={handleLogout}>
            <strong>Log out</strong>
          </button>
        </form>
      </>
    );
  }

  return <div className="card">{settingsCard}</div>;
}

export default SettingsCard;
