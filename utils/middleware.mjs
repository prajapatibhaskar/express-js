import { users } from "../utils/db.js";

const mockUsers = users;

// Middleware to get the userIndex after some validations
export const resolveUserIndexById = (req, res, next) => {
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
