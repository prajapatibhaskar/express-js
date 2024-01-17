import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import {
  getAllUsersValidation,
  createUserValidationSchema,
} from "../../utils/validationSchemas.mjs";
import { users } from "../../utils/db.js";
import { writeUsersToFile } from "../../utils/fileUtil.js";
import { resolveUserIndexById } from "../../utils/middleware.mjs";

const router = Router();

const mockUsers = users;

// 2. Get all users with query params if provided)
router.get("/api/users", checkSchema(getAllUsersValidation), (req, res) => {
  const errors = validationResult(req);
  console.log(errors);

  // if there are errors (!errors.isEmpty())
  //   if (!errors.isEmpty())
  //     return res.status(400).send({ errors: errors.array() });

  const {
    query: { filter, value },
  } = req;

  if (filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));

  // when filter and value is undefined
  return res.send(mockUsers);
});

// 3. Create a user (with Validation)
router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (req, res) => {
    const errors = validationResult(req);
    console.log(errors);

    // if there are errors (!errors.isEmpty())
    if (!errors.isEmpty())
      return res.status(400).send({ errors: errors.errors });

    const data = matchedData(req);

    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };

    mockUsers.push(newUser);

    // Write updated users array to db.js file
    writeUsersToFile(mockUsers);

    return res.status(201).send(newUser);
  }
);

// 4. Get a specific user by id
router.get("/api/users/:id", resolveUserIndexById, (req, res) => {
  const { userIndex } = req;
  const user = mockUsers[userIndex];

  return res.send(user);
});

// 5. Update the user data (PUT request)
router.put("/api/users/:id", resolveUserIndexById, (req, res) => {
  const { body, userIndex } = req;

  mockUsers[userIndex] = { id: mockUsers[userIndex].id, ...body };

  // Write updated users array to db.js file
  writeUsersToFile(mockUsers);

  return res.sendStatus(200);
});

// 6. Update the user data (PATCH request)
router.patch("/api/users/:id", resolveUserIndexById, (req, res) => {
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
router.delete("/api/users/:id", resolveUserIndexById, (req, res) => {
  const { userIndex } = req;

  mockUsers.splice(userIndex, 1);

  // Write updated users array to db.js file
  writeUsersToFile(mockUsers);

  return res.sendStatus(200);
});

export default router;
