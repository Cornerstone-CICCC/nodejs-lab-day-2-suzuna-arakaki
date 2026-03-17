import { Router } from "express";
import userController from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/signup", userController.addUser);
userRouter.get("/:username", userController.getUserByUsername);
userRouter.get("/login", userController.getLoginUser);
userRouter.post("/login", userController.loginUser);
userRouter.get("/logout", userController.logout);

export default userRouter;
