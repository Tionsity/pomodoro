import { Link } from "react-router-dom";
import { update } from "../helpers/update";
import { use, useState } from "react";
import placeholder from "../assets/icons/placeholder.png";
import { colorPalette } from "../helpers/colorPalette.jsx";

export function NewProject() {
  let startTitle = "Choose a title for your project";
  let [title, SetTitle] = useState(startTitle);

  let inputStepStart = "title";
  let [inputStep, setInputStep] = useState(inputStepStart);

  let userInputStart = "";
  let [userInput, setUserInput] = useState(userInputStart);

  let chosenTitleStart = "";
  let [chosenTitle, setChosenTitle] = useState(chosenTitleStart);
  let chosenDescriptionStart = "";
  let [chosenDescription, setChosenDescription] = useState(
    chosenDescriptionStart,
  );
  let chosenColorStart = "";
  let [chosenColor, setChosenColor] = useState(chosenColorStart);
  let chosenNumberOfPomodorosStart = null;
  let [chosenNumberOfPomodoros, setchosenNumberOfPomodoros] = useState(
    chosenNumberOfPomodorosStart,
  );
  let [chosenMilestone, setChosenMilestone] = useState(null);
  let [noMilestone, setNoMilestone] = useState(null);

  let card = (
    <div className="newProjectCard">
      <h2>{title}</h2>
      <input
        className="newProjectInput"
        type={inputStep === "numberOfPomodoros" ? "number" : "text"}
        placeholder="Title"
        onChange={(event) => setUserInput(event.target.value)}
      />
      <br />
      {inputStep === "review" && (
        <div className="reviewSettings">
          <p className="showTitle">Title: {chosenTitle}</p>
          <p className="showDesription">Description: {chosenDescription}</p>
          <p className="showColor">Color: {chosenColor}</p>
          <p className="showNumberofPomodoros">
            Number of Pomodoros: {chosenNumberOfPomodoros}
          </p>
          <p className="showChosenMilestone">Milestone: {chosenMilestone}</p>
          <br />
        </div>
      )}
      {inputStep === "color" && colorPalette(setChosenColor)}
      {inputStep === "done" && <img src={placeholder} alt="A happy tomato" />}
      <br />
      <button
        onClick={async () => {
          if (
            userInput === "" &&
            inputStep !== "description" &&
            inputStep !== "review" &&
            inputStep !== "color" &&
            inputStep !== "milestone"
          ) {
            SetTitle("Ya gotta choose somethin' dude!");
          } else {
            if (inputStep === "title") {
              setChosenTitle(userInput);
              document.getElementsByClassName(
                "newProjectInput",
              )[0].placeholder = "Description";
              setInputStep("description");
              SetTitle("Do you want a description for your project?");
            }
            if (inputStep === "description") {
              if (userInput === "") {
                setChosenDescription("Yeah, I didn't choose no descrip'");
              } else {
                setChosenDescription(userInput);
              }
              document.getElementsByClassName(
                "newProjectInput",
              )[0].style.visibility = "hidden";
              setInputStep("color");
              SetTitle("What color do you want for your project?");
            }
            if (inputStep === "color") {
              document.getElementsByClassName(
                "newProjectInput",
              )[0].placeholder = "Number of Pomodoros";
              setInputStep("numberOfPomodoros");
              SetTitle("How many Pomodoros do you want for this project?");
              document.getElementsByClassName(
                "newProjectInput",
              )[0].style.visibility = "visible";
            }
            if (inputStep === "numberOfPomodoros") {
              document.getElementsByClassName(
                "newProjectInput",
              )[0].placeholder = "Milestone";
              setchosenNumberOfPomodoros(userInput);
              setInputStep("milestone");
              SetTitle(
                "Would you like to add a first milestone to your project?",
              );
            }
            if (inputStep === "milestone") {
              if (userInput !== "") {
                setChosenMilestone(userInput);
              } else {
                setChosenMilestone("No milestone added");
                setNoMilestone(true);
              }
              document.getElementsByClassName(
                "newProjectInput",
              )[0].style.visibility = "hidden";
              setInputStep("review");
              SetTitle("You fine with these settings?");
            }
            if (inputStep === "review") {
              setInputStep("done");
              const data = await update(
                {
                  chosenTitle,
                  chosenDescription,
                  chosenColor,
                  chosenNumberOfPomodoros,
                  chosenMilestone,
                  noMilestone,
                },
                "POST",
                "projects",
              );
              if (data.projectedAdded) {
                SetTitle("Your project was added!");
              } else {
                SetTitle("Something went wrong...");
              }
            }

            document.getElementsByClassName("newProjectInput")[0].value = "";
            setUserInput("");
          }
        }}>
        {inputStep === "review"
          ? "Create Project"
          : inputStep === "done"
            ? "Go to project"
            : "Next"}
      </button>
    </div>
  );

  return (
    <>
      <h1>Create a new Project!</h1>
      {card}
      <Link to="/">Get back</Link>
    </>
  );
}
