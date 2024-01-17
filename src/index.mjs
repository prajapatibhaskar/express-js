import express from "express";
import { users } from "../utils/db.js";
import { writeUsersToFile } from "../utils/fileUtil.js";
import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import {
  createUserValidationSchema,
  getAllUsersValidation,
} from "../utils/validationSchemas.mjs";

const app = express();

// Middleware to parse JSON in the request body
app.use(express.json());

const someRandomMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

// Middleware to get the userIndex after some validations
const resolveUserIndexById = (req, res, next) => {
  const {
    params: { id },
  } = req;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);

  const userIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (userIndex === -1) return res.sendStatus(404);

  // we add this new property to the req object
  req.userIndex = userIndex;
  next();
};

// Applied Globally for each api after this line (Order matters)
// app.use(someRandomMiddleware);

const PORT = process.env.PORT || 3000;

const mockUsers = users;

// 1. Home page
app.get("/", (req, res) => {
  res.status(201).send({ message: "Hello" });
});

// 2. Get all users (with query params if provided)
app.get("/api/users", checkSchema(getAllUsersValidation), (req, res) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(400).send({ errors: errors.array() });

  const data = matchedData(req);
  const {
    query: { filter, value },
  } = req;

  if (filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));

  // when filter and value is undefined
  return res.send(mockUsers);
});

// 3. Create a new user
app.post("/api/users", checkSchema(createUserValidationSchema), (req, res) => {
  const errors = validationResult(req);
  console.log(errors);

  // if result is not
  if (!errors.isEmpty()) return res.status(400).send({ errors: errors.errors });

  const data = matchedData(req);

  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };

  mockUsers.push(newUser);

  // Write updated users array to db.js file
  writeUsersToFile(mockUsers);

  return res.status(201).send(newUser);
});

// 4. Get a specific user by id
app.get("/api/users/:id", resolveUserIndexById, (req, res) => {
  const { userIndex } = req;
  const user = mockUsers[userIndex];

  return res.send(user);
});

// 5. Update the user data (PUT request)
app.put("/api/users/:id", resolveUserIndexById, (req, res) => {
  const { body, userIndex } = req;

  mockUsers[userIndex] = { id: mockUsers[userIndex].id, ...body };

  // Write updated users array to db.js file
  writeUsersToFile(mockUsers);

  return res.sendStatus(200);
});

// 6. Update the user data (PATCH request)
app.patch("/api/users/:id", resolveUserIndexById, (req, res) => {
  const { body, userIndex } = req;

  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...body,
    id: mockUsers[userIndex].id,
  };

  // Write updated users array to db.js file
  writeUsersToFile(mockUsers);

  return res.sendStatus(200);
});

// 7. Delete user by id (DELETE request)
app.delete("/api/users/:id", resolveUserIndexById, (req, res) => {
  const { userIndex } = req;

  mockUsers.splice(userIndex, 1);

  // Write updated users array to db.js file
  writeUsersToFile(mockUsers);

  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
