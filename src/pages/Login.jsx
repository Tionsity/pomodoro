import { useState } from "react";

export function Login() {
  let [usernameInput, setUsername] = useState("");
  let [password, setPassword] = useState("");
  async function handleSubmit(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:3001/api/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usernameInput,
        password,
      }),
    });
    const data = await response.json();

    if (data.noUser) {
      alert("Dat username does not exist!");
    } else if (data.loginSuccessful) {
      alert("Ya in!");
    } else {
      alert("Wrong Password!");
    }
  }
  return (
    <main>
      <h1>Log it on in!</h1>
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
          Password
          <input
            type="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <br />
        <button type="submit">Log it on in!</button>
      </form>
    </main>
  );
}

export default Login;
