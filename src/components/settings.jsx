import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import playSound from "../helpers/playSound.js";
import { stopSound } from "../helpers/playSound.js";

function SmallSettingsCard({ openSetting, chosenSound, setchosenSound }) {
  const startTestButtonText = "Test Sound";
  const [testButtonText, setTestButtonText] = useState(startTestButtonText);
  const [testButtonStarted, setTestButtonStarted] = useState(false);
  const [settings, setSettings] = useState([]);
  async function userSettings() {
    const response = await fetch("http://localhost:3001/api/settings", {
      credentials: "include",
    });
    const data = await response.json();

    setSettings(data);
  }

  useEffect(() => {
    userSettings();
  }, []);

  useEffect(() => {
    if (settings.chosenSound) {
      setchosenSound(settings.chosenSound);
    }
  }, [settings]);

  if (openSetting === "sound") {
    let testSounds = {
      one: chosenSound + "Pm",
      two: chosenSound + "Break",
    };

    async function soundPlaying() {
      if (testButtonStarted === true) {
        stopSound();
      }
      setTestButtonStarted(true);
      playSound();
      setTestButtonText("Sound of completed Pomodoro");
      await playSound(testSounds.one);
      setTestButtonText("Sound of completed Break");
      await playSound(testSounds.two);
      setTestButtonText(startTestButtonText);
      setTestButtonStarted(false);
    }

    // async function testButton() {
    //   if (!testButtonStarted) {
    //     soundPlaying()
    //   } else {
    //     stopSound();
    //     soundPlaying()
    // }
    return (
      <div className="smallSettingsCard">
        <h4>Which set of sounds would you prefer?</h4>
        <button
          className={
            chosenSound === "ding"
              ? "underlineableButton selected"
              : "underlineableButton"
          }
          onClick={() => setchosenSound("ding")}>
          Ding
        </button>
        <button
          className={
            chosenSound === "piano"
              ? "underlineableButton selected"
              : "underlineableButton"
          }
          onClick={() => setchosenSound("piano")}>
          Piano
        </button>
        <button
          className={
            chosenSound === "sam"
              ? "underlineableButton selected"
              : "underlineableButton"
          }
          onClick={() => setchosenSound("sam")}>
          MS Sam
        </button>
        <button
          className={
            chosenSound === "kino"
              ? "underlineableButton selected"
              : "underlineableButton"
          }
          onClick={() => setchosenSound("kino")}>
          Absolute Kino
        </button>
        <br />
        <button className="testButton" onClick={() => soundPlaying()}>
          {testButtonText}
        </button>
      </div>
    );
  }

  if (openSetting === "break") {
    return (
      <div className="smallSettingsCard">
        <h4>Include a long break or nah?</h4>
        <p>(This option gives you a break of 15 minutes every 4 Pomodoros)</p>
      </div>
    );
  }

  return null;
}

function SettingsCard() {
  const [chosenSound, setchosenSound] = useState("");
  async function submitSettings(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:3001/api/settings", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chosenSound,
      }),
    });
  }

  const { handleLogout } = useContext(AuthContext);

  const [accountSettingsOpen, setaccountSettingsOpen] = useState(false);
  const [pomodoroSettingsOpen, setpomodoroSettingsOpen] = useState(false);

  const [openSetting, setOpenSetting] = useState(null);

  let settingsCard;

  if (accountSettingsOpen === true) {
    settingsCard = (
      <>
        <h2>Dis be da account settings</h2>
        <br />
        <p>Change password</p>
        <p>Delete account</p>
        <p>Change E-mail</p>
        <p>Change username</p>
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
        <button onClick={() => setOpenSetting("sound")}>Which sound </button>
        {openSetting === "sound" && (
          <SmallSettingsCard
            openSetting={openSetting}
            chosenSound={chosenSound}
            setchosenSound={setchosenSound}
          />
        )}
        <br />
        <button onClick={() => setOpenSetting("break")}>Break settings</button>
        {openSetting === "break" && (
          <SmallSettingsCard openSetting={openSetting} />
        )}
        <br />
        <br />
        <button
          onClick={(event) => {
            submitSettings(event);

            setpomodoroSettingsOpen(false);
          }}>
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
