import express from "express";
import cors from "cors";
import argon2 from "argon2";
import { ObjectId } from "mongodb";
import { connectToDb } from "./db.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { Resend } from "resend";
import { randomInt } from "crypto";

const app = express();

const resend = new Resend(process.env.RESEND_API_KEY);

function checkValidity(username, email) {
  let wrongUsername;
  let wrongEmail;
  if (username !== undefined) {
    const validUsername = /^[a-zA-Z0-9_]+$/.test(username);
    if (!validUsername) {
      wrongUsername = true;
    } else {
      wrongUsername = false;
    }
  }
  if (email !== undefined) {
    const validEmail = /^[a-zA-Z0-9_@.]+$/.test(email);
    if (!validEmail) {
      wrongEmail = true;
    } else {
      wrongEmail = false;
    }
  }
  return { wrongUsername, wrongEmail };
}

function emailCode() {
  // return randomInt(100000, 1000000);
  return 123456;
}

async function sendEmail(email, code) {
  const { data, error } = await resend.emails.send({
    from: "Pomodoro <contact@tionsity.dev>",
    to: "naifddqn@sharklasers.com",
    subject: "Ye Olde Code",
    html: `<p>Your verification code is <strong>${code}</strong></p>`,
  });

  let errorHappened = false;

  if (error) {
    console.log(error);
    errorHappened = true;
  }

  return { data, errorHappened };
}

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 60 * 60 * 24,
    }),

    cookie: {
      httpOnly: true,
    },
  }),
);

const db = await connectToDb();

async function checkUser(user, value) {
  const userSearch = await db.collection("users").findOne({ [user]: value });
  return userSearch;
}

app.post("/api/check-user", async (req, res) => {
  let { usernameInput, emailInput, password } = req.body;

  usernameInput = usernameInput.toLowerCase();
  emailInput = emailInput.toLowerCase();
  const validity = checkValidity(usernameInput, emailInput);

  if (validity.wrongUsername) {
    return res.json({
      usernameExists: false,
      emailExists: false,
      validUsername: false,
      accountCreated: false,
    });
  }
  if (validity.wrongEmail) {
    return res.json({
      usernameExists: false,
      emailExists: false,
      validUsername: true,
      validEmail: false,
      accountCreated: false,
    });
  }

  let usernameExists = null;
  let emailExists = null;

  const user = await checkUser("username", usernameInput);
  const email = await checkUser("email", emailInput);

  if (user === null) {
    usernameExists = false;
  } else {
    usernameExists = true;
  }
  if (email === null) {
    emailExists = false;
  } else {
    emailExists = true;
  }

  if (!usernameExists && !emailExists) {
    const passwordHash = await argon2.hash(password);
    await db.collection("users").insertOne({
      username: usernameInput,
      email: emailInput.toLowerCase(),
      passwordHash,
      createdAt: new Date(),
      verified: false,
    });
  }

  res.json({
    usernameExists: Boolean(usernameExists),
    emailExists: Boolean(emailExists),
    validUsername: Boolean(validUsername),
    accountCreated: !usernameExists && !emailExists,
  });
});

//Function to update username, email and password for user
app.patch("/api/user", async (req, res) => {
  let {
    newUsername,
    newPassword,
    newEmail,
    oldPassword,
    emailCodeInput,
    codeEntered,
    cancelAuth,
  } = req.body;
  if (cancelAuth) {
    delete req.session.auth;
  }
  //Checking to see if user is logged in
  if (req.session.userId) {
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(req.session.userId) });

    if (!user) {
      return res.json({ loggedIn: false });
    }

    async function dbUpdate(update) {
      await db.collection("users").updateOne(
        { _id: new ObjectId(req.session.userId) },
        {
          $set: update,
        },
      );
      delete req.session.auth;
    }

    //Starting the update process if the email code is verified
    if (req.session.auth?.codeVerified) {
      //Checking for non allowed characters in user's input
      const validity = checkValidity(newUsername, newEmail);

      if (validity.wrongUsername || validity.wrongEmail) {
        return res.json({ wrongCharacters: true });
      }

      //Making sure user input is not undefined
      if (newUsername !== undefined) {
        //Checking if user enters the same username as the current username
        if (newUsername === user.username) {
          return res.json({ currentValue: true });
        } else {
          //Checking if the new username already exists
          const usernameCheck = await checkUser("username", newUsername);

          if (usernameCheck !== null) {
            return res.json({ usernameExists: true });
          } else {
            await dbUpdate({ username: newUsername });
            return res.json({ valueUpdated: true });
          }
        }
      }

      //Same logic as username
      if (newEmail !== undefined) {
        if (newEmail === user.email) {
          return res.json({ currentValue: true });
        } else {
          const emailCheck = await checkUser("email", newEmail);

          if (emailCheck !== null) {
            return res.json({ emailExists: true });
          } else {
            await dbUpdate({ email: newEmail });
            return res.json({ valueUpdated: true });
          }
        }
      }

      //Storing new password in variable with Argon
      if (newPassword !== undefined) {
        const isOldPassword = await argon2.verify(
          user.passwordHash,
          newPassword,
        );
        if (isOldPassword) {
          return res.json({ currentValue: true });
        } else {
          const newPasswordHash = await argon2.hash(newPassword);
          await dbUpdate({ passwordHash: newPasswordHash });
          return res.json({ valueUpdated: true });
        }
      }
    } else {
      //Using Argon to check if password is correct and storing it in a variable
      const passwordIsCorrect = await argon2.verify(
        user.passwordHash,
        oldPassword,
      );
      console.log("passwordIsCorrect:", passwordIsCorrect);

      //Returning a variable as true if password is not correct. User is not allowed to proceed if password is incorrect
      if (!passwordIsCorrect) {
        return res.json({ incorrectPassword: true });
      } else {
        //Checking to see if user has entered the verification code
        if (codeEntered) {
          //Checking if the authentification session is running
          if (!req.session.auth) {
            return res.json({ sessionError: true });
          } else {
            //Checking if user has entered code within the timeframe
            if (Date.now() > req.session.auth.expiresAt) {
              delete req.session.auth;
              return res.json({ expired: true });
            } else {
              //Checking if user has exeeded the number of attempts at entering the correct code
              if (req.session.auth.codeAttempts >= 5) {
                delete req.session.auth;
                return res.json({ maxAttempts: true });
              } else {
                //Checking if correct code is entered
                if (Number(emailCodeInput) !== req.session.auth.code) {
                  req.session.auth.codeAttempts++;

                  return res.json({
                    incorrectCode: true,
                    attempts: req.session.auth.codeAttempts,
                    maxAttempts: 5,
                  });
                } else {
                  //Setting the email code as verified
                  req.session.auth = {
                    codeVerified: true,
                    expiresAt: Date.now() + 1000 * 60 * 10,
                  };
                  return res.json({ codeVerified: true });
                }
              }
            }
          }
        } else {
          req.session.auth = {
            //Generating one time code
            code: emailCode(),

            //Setting time of expiery for code
            expiresAt: Date.now() + 1000 * 60 * 10,

            //Putting number of attempts in variable
            codeAttempts: 0,

            //Checking if code is verified
            codeVerified: false,
          };

          //Sending verification email to user, checking for errors and deleting session if errors
          const emailResult = await sendEmail(
            user.email,
            req.session.auth.code,
          );

          if (!emailResult.errorHappened) {
            return res.json({ codeSent: true });
          } else {
            delete req.session.auth;
            return res.json({ emailError: true });
          }
        }
      }
    }
  }

  //Returning variable if user is not logged in
  return res.json({ loggedIn: false });
});

//Function for deleting account
app.delete("/api/delete", async (req, res) => {
  //Waiting for delete prompt from frontend
  let { deleteAccount } = req.body;
  if (deleteAccount) {
    //Making sure user is logged in
    if (req.session.userId) {
      //Making sure code is verified
      if (req.session.auth?.codeVerified) {
        //Removing the user account along with settings, sessions, journal entries and projects
        await db.collection("users").deleteOne({
          _id: new ObjectId(req.session.userId),
        });
        await db.collection("settings").deleteMany({
          userid: new ObjectId(req.session.userId),
        });
        await db.collection("pomodoroSessions").deleteMany({
          userid: new ObjectId(req.session.userId),
        });
        await db.collection("journalEntries").deleteMany({
          userid: new ObjectId(req.session.userId),
        });
        await db.collection("projects").deleteMany({
          userid: new ObjectId(req.session.userId),
        });

        //Destroying all sessions when deletion is complete
        return req.session.destroy((err) => {
          //Returning an error message if session is not destroyed
          if (err) {
            return res.status(500).json({
              error: "Logout failed",
            });
          }
          //Returning a confirmation of account deletion to frontend
          return res.json({ accountDeleted: true });
        });
      }
    }
  }
  //Returning a confirmation that account was not deleted if anything goes wrong
  return res.json({ accountDeleted: false });
});

app.post("/api/login", async (req, res) => {
  let { usernameInput, password, stayLoggedIn } = req.body;

  usernameInput = usernameInput.toLowerCase();

  console.log("Searching for username:", JSON.stringify(usernameInput));

  const user = await db.collection("users").findOne({
    username: {
      $regex: `^${usernameInput}$`,
      $options: "i",
    },
  });

  if (!user) {
    return res.json({
      noUser: true,
    });
  }

  const passwordIsCorrect = await argon2.verify(user.passwordHash, password);

  if (passwordIsCorrect) {
    req.session.userId = user._id;

    if (stayLoggedIn) {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 90;
    }

    return res.json({
      loginSuccessful: true,
    });
  }

  return res.json({
    loginSuccessful: false,
  });
});

app.get("/api/me", async (req, res) => {
  if (req.session.userId) {
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(req.session.userId) });
    if (!user) {
      return res.json({ loggedIn: false });
    }
    return res.json({
      loggedIn: true,
      user: user.username,
    });
  }

  return res.json({
    loggedIn: false,
  });
});

app.get("/api/projects", async (req, res) => {
  if (req.session.userId) {
    const projects = await db
      .collection("projects")
      .find({ userid: new ObjectId(req.session.userId) })
      .toArray();
    return res.json(projects);
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: "Logout failed",
      });
    }

    return res.json({
      loggedIn: false,
    });
  });
});

app.get("/api/settings", async (req, res) => {
  if (req.session.userId) {
    const settings = await db
      .collection("settings")
      .findOne({ userid: new ObjectId(req.session.userId) });
    return res.json(settings);
  }
});

app.post("/api/settings", async (req, res) => {
  let { chosenSound, breakLong } = req.body;

  await db
    .collection("settings")
    .updateOne(
      { userid: new ObjectId(req.session.userId) },
      { $set: { chosenSound, breakLong } },
    );

  return res.json({
    chosenSound: chosenSound,
    breakLong: breakLong,
  });
});

console.log("Server connected to MongoDB. So far so donuts!");

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
