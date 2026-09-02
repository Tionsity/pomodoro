import dingPm from "../assets/sounds/ding/ding_pm_end.mp3";
import dingBreak from "../assets/sounds/ding/ding_break_end.mp3";

import pianoPm from "../assets/sounds/piano/piano_pm_end.mp3";
import pianoBreak from "../assets/sounds/piano/piano_break_end.mp3";

import samPm from "../assets/sounds/ms_sam/ms_sam_pm_end.mp3";
import samBreak from "../assets/sounds/ms_sam/ms_sam_break_end.mp3";

import kinoPm from "../assets/sounds/kino/kino_pm_end.mp3";
import kinoBreak from "../assets/sounds/kino/kino_break_end.mp3";

import timer from "/src/assets/sounds/timer.mp3";

let currentSound;

async function playSound(soundFile) {
  const sounds = {
    dingPm,
    dingBreak,
    pianoPm,
    pianoBreak,
    samPm,
    samBreak,
    kinoPm,
    kinoBreak,
  };
  currentSound = new Audio(sounds[soundFile]);
  currentSound.play();

  return new Promise((resolve) => {
    currentSound.addEventListener("ended", function () {
      currentSound.currentTime = 0;
      resolve();
    });
  });
}

export function stopSound() {
  currentSound.pause();
  currentSound.currentTime = 0;
}

export default playSound;
