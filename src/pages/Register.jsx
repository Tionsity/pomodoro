import { useState } from "react";

function Register() {
  let [usernameInput, setUsername] = useState("");
  let [emailInput, setEmail] = useState("");
  let [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:3001/api/check-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usernameInput,
        emailInput,
        password,
      }),
    });
    const data = await response.json();

    if (data.usernameExists === true && data.emailExists === false) {
      alert("There is already a user with that username");
    } else if (data.emailExists === true && data.usernameExists === false) {
      alert("This e-mail address is already in use");
    } else if (data.usernameExists === true && data.emailExists === true) {
      alert("Ya gotta change both e-mail and username");
    } else if (data.accountCreated === true) {
      alert("The account was created");
    } else if (!data.validUsername) {
      alert(
        "Your account name can only include the letters A-Z, letters 0-9 and _",
      );
    } else {
      alert("Something went wrong");
    }
  }
  return (
    <main>
      <h1>Register a new account</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            name="username"
            value={usernameInput}
            onChange={(event) => setUsername(event.target.value)}
          />
          <br />
        </label>
        <label>
          E-mail
          <input
            type="email"
            name="email"
            value={emailInput}
            onChange={(event) => setEmail(event.target.value)}
          />
          <br />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <br />
          <br />
        </label>
        <button type="submit">Create Account</button>
      </form>
    </main>
  );
}

export default Register;
