const express = require("express");
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/sum", (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  if (isNaN(a) || isNaN(b)) {
    res.status(400).json({ error: "Invalid input" });
  } else {
    res.json({ sum: a + b });
  }
});

app.listen(3000, () => console.log("Listening on port 3000"));