import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

const mockUsers = [
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
];

// 1. Home page
app.get("/", (req, res) => {
  res.status(201).send({ message: "Hello" });
});

// 2. Get all users
app.get("/api/users", (req, res) => res.send(mockUsers));

// 3. Get a specific user by id
app.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);

  // if id is not valid
  if (isNaN(parsedId)) {
    return res.status(400).send({
      msg: "Bad Request. Invalid ID",
    });
  }

  const findUser = mockUsers.find((user) => user.id === parsedId);

  // if id is not found in mockUsers
  if (!findUser) return res.status(404).send({ msg: "User not found" });

  return res.send(findUser);
});

// 4. Get products
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
