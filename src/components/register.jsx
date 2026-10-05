import { useState } from "react";
import { update } from "../helpers/update.js";

export function useRegister(emailInput, usernameInput, password, codeInput) {
  const [inputStep, setInputStep] = useState("choose");

  async function handleSubmit(event) {
    event.preventDefault();
    // const response = await fetch("http://localhost:3001/api/check-user", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    // usernameInput,
    // emailInput,
    // password,
    //   }),
    // });
    // const data = await response.json();

    const values = { usernameInput, emailInput, password, codeInput };
    const data = await update(values, "POST", "check-user");
    console.log(data);

    if (inputStep === "choose") {
      if (data.usernameExists === true && data.emailExists === false) {
        alert("There is already a user with that username");
      } else if (data.emailExists === true && data.usernameExists === false) {
        alert("This e-mail address is already in use");
      } else if (data.usernameExists === true && data.emailExists === true) {
        alert("Ya gotta change both e-mail and username");
      } else if (data.codeSent === true) {
        setInputStep("code");
      } else if (!data.validUsername) {
        alert(
          "Your account name can only include the letters A-Z, letters 0-9 and _",
        );
      } else {
        alert("Something went wrong");
      }
    }
    if (inputStep === "code") {
      if (data.wrongCode) {
        alert("Wrong code!");
        location.reload();
      }
      if (data.accountCreated) {
        alert("Your account was created");
        location.reload();
      }
    }
  }
  return { handleSubmit, inputStep };
}

export default useRegister;
