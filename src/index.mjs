import express from "express";
import { users } from "../utils/db.js";
import { writeUsersToFile } from "../utils/fileUtil.js";

const app = express();

// Middleware to parse JSON in the request body
app.use(express.json());

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

// 5. Create a new user
app.post("/api/users", (req, res) => {
  const { body } = req;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };

  mockUsers.push(newUser);

  // Write updated users array to db.js file
  writeUsersToFile(mockUsers);

  return res.status(201).send(newUser);
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

// 6. Update the user data (PUT request)
app.put("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return res.sendStatus(400);
  }

  const userIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (userIndex === -1) {
    return res.sendStatus(404);
  }

  mockUsers[userIndex] = { id: parsedId, ...body };

  // Write updated users array to db.js file
  writeUsersToFile(mockUsers);

  return res.sendStatus(200);
});

//7. Update the user data (PATCH request)
app.patch("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);

  const userIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (userIndex === -1) return res.sendStatus(404);

  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...body,
    id: mockUsers[userIndex].id,
  };

  // Write updated users array to db.js file
  writeUsersToFile(mockUsers);

  return res.sendStatus(200);
});

//8. Delete user by id (DELETE request)
app.delete("/api/users/:id", (req, res) => {
  const {
    params: { id },
  } = req;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);

  const userIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (userIndex === -1) return res.sendStatus(404);

  mockUsers.splice(userIndex, 1);

  // Write updated users array to db.js file
  writeUsersToFile(mockUsers);

  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
