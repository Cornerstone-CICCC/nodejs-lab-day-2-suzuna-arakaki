import { Request, Response } from "express";
import { User } from "../types/user.types";
import userModel from "../models/user.model";
import zxcvbn from "zxcvbn";
import { addListener } from "process";

const getUserByUsername = (
  req: Request<{ username: string }>,
  res: Response,
) => {
  const username = req.params.username;
  const user = userModel.findByUsername(username);
  if (!user) {
    res.status(500).json({
      error: "Username not found!!",
    });
  }
  res.status(200).json(user);
};

const getLoginUser = (req: Request, res: Response) => {
  res.status(200).render("login");
};

const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username.trim() || !password.trim()) {
    res.status(400).send("Username or password can not be empty!");
  }

  const loggedinUser = await userModel.login(username, password);
  if (!loggedinUser) {
    res.status(400).send("User doesn't exist or your password is incorrect!");
  }

  res.cookie("isLoggedIn", true, {
    maxAge: 30 * 60 * 1000, // 30 minutes
    httpOnly: true,
    signed: true,
  });
  res.status(301).redirect("/loggedinHome");
};

const addUser = async (
  req: Request<{}, {}, Omit<User, "id">>,
  res: Response,
) => {
  const { username, password, firstname, lastname } = req.body;
  if (
    !username.trim() ||
    !password.trim() ||
    !firstname.trim() ||
    !lastname.trim()
  ) {
    res.status(400).json({
      error: "Please fill out all informations.",
    });
    return;
  }
  const passwordScore = zxcvbn(password).score;
  if (passwordScore <= 2) {
    res.status(400).json({
      error: "Password is too weak",
    });
    return;
  }
  const newUser: User | null = await userModel.create(
    username,
    password,
    firstname,
    lastname,
  );
  if (!newUser) {
    res.status(500).json({
      error: "Username is taken... :(",
    });
    return;
  }
  res.status(200).json(newUser);
};

const logout = (req: Request, res: Response) => {
  res.clearCookie("isLoggedIn");
  res.clearCookie("message");

  if (req.session) {
    req.session = null;
  }

  res.status(301).redirect("login");
};

export default {
  getUserByUsername,
  getLoginUser,
  loginUser,
  addUser,
  logout,
};
