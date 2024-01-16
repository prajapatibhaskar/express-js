import express from "express";
import { users } from "../utils/db.js";

const app = express();

const PORT = process.env.PORT || 3000;

const mockUsers = users;

// 1. Home page
app.get("/", (req, res) => {
  res.status(201).send({ message: "Hello" });
});

// 2. Get all users (with query params if provided)
app.get("/api/users", (req, res) => {
  console.log(req.query);

  const {
    query: { filter, value },
  } = req;

  if (filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));
    
  // when filter and value is undefined
  return res.send(mockUsers);
});

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
