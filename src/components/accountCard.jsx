import { useEffect, useState } from "react";

import useRegister from "./register.jsx";
import useLogin from "./login.jsx";

function AccountCard() {
  const [registerInputStup, setRegisterInputste] = useState("chooseValues");

  let h3Text = "";
  let button = "";

  const [accountMode, setAccountMode] = useState("login");

  const [usernameInput, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailInput, setEmail] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const login = useLogin(usernameInput, password, stayLoggedIn);
  const register = useRegister(emailInput, usernameInput, password, codeInput);

  let handleSubmit;

  if (accountMode === "login") {
    handleSubmit = login.handleSubmit;
  } else if (accountMode === "register") {
    handleSubmit = register.handleSubmit;
  }

  const [text, setText] = useState(h3Text);
  const [buttonText, setbuttonText] = useState(button);

  useEffect(() => {
    if (accountMode === "register") {
      setText("Register");
      setbuttonText("Submit");
    } else if (accountMode === "login") {
      setText("Login");
      setbuttonText("Login");
    }
  });

  return (
    <div className="card">
      {register.inputStep !== "code" && (
        <div id="notCode">
          <input
            type="checkbox"
            id="switch"
            checked={accountMode === "register"}
            onChange={(event) => {
              if (event.target.checked) {
                setAccountMode("register");
              } else {
                setAccountMode("login");
              }
            }}
          />
          <label className="switch" htmlFor="switch">
            Toggle
          </label>
          <form onSubmit={handleSubmit}>
            <h3>{text}</h3>
            {accountMode === "register" && register.inputStep === "choose" && (
              <>
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(event) => setEmail(event.target.value)}></input>
                <br />
              </>
            )}
            <label htmlFor="username">Username</label>
            <input
              type="text"
              value={usernameInput}
              onChange={(event) => setUsername(event.target.value)}
            />
            <br />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <br />
            {accountMode === "login" && (
              <div className="stayloggedincheckbox">
                <p>Stay logged in</p>
                <input
                  type="checkbox"
                  className="stayloggedin"
                  checked={stayLoggedIn}
                  onChange={(event) => setStayLoggedIn(event.target.checked)}
                />
              </div>
            )}
            <br />
            <button type="submit">{buttonText}</button>
          </form>
        </div>
      )}
      {accountMode === "register" && register.inputStep === "code" && (
        <>
          <form onSubmit={register.handleSubmit}>
            <label>
              Please enter the verification code that was sent to {emailInput}
            </label>
            <br />
            <input
              type="text"
              placeholder="Code"
              value={codeInput}
              onChange={(event) => setCodeInput(event.target.value)}
            />
            <br />
            <button type="submit">Submit code</button>
          </form>
        </>
      )}
    </div>
  );
}

export default AccountCard;
