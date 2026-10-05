import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ding from "../assets/sounds/ding/ding_pm_end.mp3";
import timer from "../assets/sounds/timer.mp3";
import { update } from "../helpers/update.js";
import playSound from "../helpers/playSound.js";
import stopSound from "../helpers/playSound.js";
import Dashboard from "../pages/Dashboard.jsx";

const data = await update(null, "GET", "projects");
// const settingsData = await update(null, "GET", "settings");

let breakCounter = 0;

let chosenSound;

export default function Timer() {
  const [settingsData, setSettingsData] = useState(null);
  async function reloadSettings() {
    setSettingsData(await update(null, "GET", "settings"));
  }
  const { loggedIn } = useContext(AuthContext);
  if (loggedIn && settingsData) {
    chosenSound = settingsData.chosenSound;
  } else {
    chosenSound = "ding";
  }
  let soundToPlay = {
    one: chosenSound + "Pm",
    two: chosenSound + "Break",
  };
  const { name, id } = useParams();
  const currentProject = data.find((project) => project._id === id);

  async function makeUpdate(updateParam) {
    await update(updateParam, "PATCH", "projects");
  }

  const startText = "Start Pomodoro";
  const startStatusText = "Ready for Pomodoro!";
  const startProgressBar = "";

  let [pomodoroNumber, setPomodoroNumber] = useState(
    currentProject.completedPomodoros,
  );
  let [statusText, setStatusText] = useState(startStatusText);
  let [text, setText] = useState(startText);
  const [mode, setMode] = useState("idle");
  let [progressbar, setProgressbar] = useState(startProgressBar);
  let [testprogress, setTestprogress] = useState("");

  const [workStart, setWorkStart] = useState(null);
  const [workStop, setWorkStop] = useState(null);

  const [breakStart, setBreakStart] = useState(null);
  const [breakStop, setBreakStop] = useState(null);

  const [longBreak, setLongBreak] = useState(false);

  // const workTime = 1500000;
  // const breakTime = 300000;
  // const breakTimeLong = 900000;

  const workTime = 3000;
  const breakTime = 3000;
  const breakTimeLong = 3000;

  const progressBars = 10;
  const progressTick = workTime / progressBars;

  const sound = new Audio(ding);
  const timerSound = new Audio(timer);
  sound.volume = 0.4;

  useEffect(() => {
    if (mode !== "idle") {
      setText("Stop Pomodoro");
    } else {
      setText(startText);
      setStatusText(startStatusText);
      setProgressbar(startProgressBar);
    }
    if (mode === "work") {
      const start = Date.now();
      const stop = start + workTime;

      setStatusText("Working...");
      setProgressbar("□□□□□□□□□□");
      setWorkStart(start);
      setWorkStop(start + workTime);

      const interval = setInterval(() => {
        let fullBoxes = Math.floor(
          ((Date.now() - start) / (stop - start)) * 10,
        );
        let emptyBoxes = Math.floor(progressBars - fullBoxes);
        setProgressbar("■".repeat(fullBoxes) + "□".repeat(emptyBoxes));
        if (Date.now() >= stop) {
          makeUpdate({
            currentProject: currentProject,
            newCurrentNumberOfPomodoros: currentProject.completedPomodoros + 1,
          });
          stopSound();
          playSound(soundToPlay.one, null);
          setPomodoroNumber(pomodoroNumber + 1);
          setMode("break");
        }
      }, 500);

      return () => {
        clearInterval(interval);
      };
    }
    if (mode === "break") {
      sound.volume = 0.5;
      const start = Date.now();

      let stop;

      if (longBreak) {
        stop = start + breakTimeLong;
      } else {
        stop = start + breakTime;
      }

      setStatusText("Break!");
      setProgressbar(startProgressBar);

      setBreakStart(start);
      if (!longBreak) {
        setBreakStop(start + breakTime);
      } else {
        setBreakStop(start + longBreak);
        setStatusText("Time for a long break!");
      }

      const interval = setInterval(() => {
        if (Date.now() >= stop) {
          if (settingsData.breakLong) {
            if (breakCounter > 2) {
              setLongBreak(false);
              breakCounter = 0;
            } else if (breakCounter === 2) {
              setLongBreak(true);
              breakCounter++;
            } else {
              breakCounter++;
            }
          }
          stopSound();
          console.log(breakCounter);
          playSound(soundToPlay.two, null);
          setMode("work");
        }
      }, 500);
      return () => {
        clearInterval(interval);
      };
    }
  }, [mode, workStop, breakStop]);

  function klickad() {
    if (mode === "idle") {
      setMode("work");
      timerSound.play();
    } else {
      setMode("idle");
    }
  }

  return (
    <div>
      <p>{statusText}</p>
      <p>
        Completed Pomodoros: {pomodoroNumber} /{" "}
        {currentProject.numberOfPomodoros}
      </p>
      <button
        onClick={async () => {
          await reloadSettings();
          klickad();
        }}>
        {text}
      </button>
      <p>{progressbar}</p>
    </div>
  );
}
