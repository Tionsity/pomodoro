import express from "express";
import cors from "cors";
import argon2 from "argon2";
import { ObjectId } from "mongodb";
import { connectToDb } from "./db.js";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();

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
      ttl: 60, //* 60 * 24,
    }),

    cookie: {
      httpOnly: true,
    },
  }),
);

const db = await connectToDb();

app.post("/api/check-user", async (req, res) => {
  let { usernameInput, emailInput, password } = req.body;
  usernameInput = usernameInput.toLowerCase();
  emailInput = emailInput.toLowerCase();
  const validUsername = /^[a-zA-Z0-9_]+$/.test(usernameInput);
  const validEmail = /^[a-zA-Z0-9_@.]+$/.test(emailInput);
  if (!validUsername) {
    return res.json({
      usernameExists: false,
      emailExists: false,
      validUsername: false,
      accountCreated: false,
    });
  }
  if (!validEmail) {
    return res.json({
      usernameExists: false,
      emailExists: false,
      validUsername: true,
      validEmail: false,
      accountCreated: false,
    });
  }
  const usernameExists = await db.collection("users").findOne({
    username: usernameInput,
  });
  const emailExists = await db.collection("users").findOne({
    email: emailInput,
  });

  if (!usernameExists && !emailExists && validUsername) {
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

  console.log("User found:", user);

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

console.log("Server connected to MongoDB. So far so donuts!");

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
