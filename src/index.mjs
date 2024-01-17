import express from "express";
import routes from "./routes/index.mjs";

const app = express();

// Middleware to parse JSON in the request body
app.use(express.json());

app.use(routes);

const PORT = process.env.PORT || 3000;

// 1. Home page
app.get("/", (req, res) => {
  res.status(201).send({ message: "Hello" });
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
