import { useState } from "react";

export function useLogin(
  usernameInput,
  password,
  stayLoggedIn,
  onLoginSuccess,
) {
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
        stayLoggedIn,
      }),
    });
    const data = await response.json();

    if (data.noUser) {
      alert("Dat username does not exist!");
    } else if (data.loginSuccessful) {
      alert("Ya in!");
      window.location.reload();
    } else {
      alert("Wrong Password!");
    }
  }
  return { handleSubmit };
}

export default useLogin;
