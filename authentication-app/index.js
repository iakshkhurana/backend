const express = require("express");
const cors = require("cors"); // Import CORS

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

const tokens = {};

function generateToken(length = 16) {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    const randomIdx = Math.floor(Math.random() * characters.length);
    token += characters[randomIdx];
  }
  return token;
}

app.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }
  const token = generateToken(20);
  tokens[token] = username;
  res.json({ message: "Login successful", token });
});

function checkToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token || !tokens[token]) {
    return res.status(401).json({ error: "Invalid or missing token" });
  }
  req.username = tokens[token];
  next();
}

app.get("/protected", checkToken, (req, res) => {
  res.json({ message: `Hello, ${req.username}. You are authorized!` });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
