export async function update(updates, method, api) {
  const response = await fetch(`http://localhost:3001/api/${api}`, {
    method: method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  return data;
}

/*
Skickas från frontend:
newUsername
newPassword
newEmail
oldPassword
emailCodeInput
codeEntered

Skickas från server:
loggedIn
incorrectPassword
sessionError
expired
maxAttempts
incorrectCode
attempts
wrongCharacters
currentUsername
usernameExists
currentEmail
emailExists
userUpdates
codeSent
emailError
*/
