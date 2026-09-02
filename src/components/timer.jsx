import { useState, useEffect } from "react";
import ding from "../assets/sounds/ding/ding_pm_end.mp3";
import timer from "../assets/sounds/timer.mp3";

export default function Timer() {
  const startText = "Start Pomodoro";
  const startStatusText = "Ready for Pomodoro!";
  const startProgressBar = "";

  let [pomodoroNumber, setPomodoroNumber] = useState(0);
  let [statusText, setStatusText] = useState(startStatusText);
  let [text, setText] = useState(startText);
  const [mode, setMode] = useState("idle");
  let [progressbar, setProgressbar] = useState(startProgressBar);
  let [testprogress, setTestprogress] = useState("");

  const [workStart, setWorkStart] = useState(null);
  const [workStop, setWorkStop] = useState(null);

  const [breakStart, setBreakStart] = useState(null);
  const [breakStop, setBreakStop] = useState(null);

  const workTime = 1500000;
  const breakTime = 300000;

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
          setPomodoroNumber((prev) => prev + 1);
          sound.play();
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
      const stop = start + breakTime;

      setStatusText("Break!");
      setProgressbar(startProgressBar);

      setBreakStart(start);
      setBreakStop(start + breakTime);

      const interval = setInterval(() => {
        if (Date.now() >= stop) {
          sound.play();
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
      <p>Number of Pomodoros: {pomodoroNumber}</p>
      <button onClick={klickad}>{text}</button>
      <p>{progressbar}</p>
    </div>
  );
}
