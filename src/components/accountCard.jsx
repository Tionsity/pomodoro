import { useEffect, useState } from "react";

import useRegister from "./register.jsx";
import useLogin from "./login.jsx";

function AccountCard() {
  let h3Text = "";
  let button = "";

  const [accountMode, setAccountMode] = useState("login");

  const [usernameInput, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailInput, setEmail] = useState("");
  const login = useLogin(usernameInput, password);
  const register = useRegister(emailInput, usernameInput, password);

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
        {accountMode === "register" && (
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
        <button type="submit">{buttonText}</button>
      </form>
    </div>
  );
}

export default AccountCard;
