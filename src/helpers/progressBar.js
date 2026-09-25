export function progressBar(sound, button) {
  let duration = sound.duration;
  button.classList.add("playing");
  button.style.setProperty("--animation-duration", `${duration}s`);
}
