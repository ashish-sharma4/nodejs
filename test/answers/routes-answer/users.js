import { Router } from "express";
import { createUsers, loginUsers } from "../controllers/users.js";
const UsersRouter = Router();

UsersRouter.post("/register", createUsers);
// JWT based Users authentication(Concurrency Test)
UsersRouter.post("/login", loginUsers);

export { UsersRouter };
