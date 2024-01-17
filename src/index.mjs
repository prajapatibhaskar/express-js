import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";

const app = express();

// Middleware to parse JSON in the request body
app.use(express.json());

// Middleware to parse COOKIE
app.use(cookieParser("helloworld"));

app.use(routes);

const PORT = process.env.PORT || 3000;

// 1. Home page
app.get("/", (req, res) => {
  res.cookie("Hello", "World", { maxAge: 30000, signed: true });
  res.status(201).send({ message: "Hello" });
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
