import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import AccountCard from "./accountCard.jsx";
import SettingsCard from "./settings.jsx";

export function TopBar() {
  const { loggedIn, username } = useContext(AuthContext);
  const [accountCardOpen, setAccountCardOpen] = useState(false);
  const [settingsCardOpen, setSettingsCardOpen] = useState(false);
  let topRightMessage = "";

  if (!loggedIn) {
    topRightMessage = (
      <button onClick={(event) => setAccountCardOpen(true)}>
        Login / Create Account
      </button>
    );
  } else {
    topRightMessage = (
      <button onClick={(event) => setSettingsCardOpen(true)}>{username}</button>
    );
  }

  return (
    <div className="topbar">
      <p>Pomodoro</p>
      <div>{topRightMessage}</div>
      {accountCardOpen && <AccountCard />}
      {settingsCardOpen && <SettingsCard />}
    </div>
  );
}
