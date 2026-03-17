import { Request, Response, NextFunction } from "express";

export const checkIsLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { isLoggedIn } = req.signedCookies;
  if (!isLoggedIn) {
    res.status(401).send("Log in to view this page!");
    return;
  }
  next();
};
