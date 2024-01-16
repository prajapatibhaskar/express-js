import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(201).send({ message: "Hello" });
});

app.get("/api/users", (req, res) => {
  res.send([
    {
      id: 1,
      username: "bhaskar",
      displayName: "bhaskar",
    },
    {
      id: 2,
      username: "adam",
      displayName: "adam",
    },
    {
      id: 3,
      username: "jack",
      displayName: "jack",
    },
  ]);
});

app.get("/api/products", (req, res) => {
  res.send([
    {
      id: 123,
      name: "Chicken",
      price: "12.99",
    },
  ]);
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
