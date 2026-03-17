// Create your server
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
// import path from "path";
import userRouter from "./routes/user.routes";

const app = express();

app.use(cookieParser(process.env.COOKIE_SIGN_KEY));

const COOKIE_SESSION_KEY1 = process.env.COOKIE_SESSION_KEY1;
const COOKIE_SESSION_KEY2 = process.env.COOKIE_SESSION_KEY2;

if (!COOKIE_SESSION_KEY1 || !COOKIE_SESSION_KEY2) {
  throw new Error("Missing cookie sessions keys!");
}

app.use(
  cookieSession({
    name: "session",
    keys: [COOKIE_SESSION_KEY1, COOKIE_SESSION_KEY2],
    maxAge: 3 * 60 * 1000, // 3 minutes
    httpOnly: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("Sorry, Invalid port!");
});

const PORT = process.env.PORT;
if (!PORT) {
  throw new Error("Missing Port");
}
app.listen(PORT, () => {
  console.log(`This server is running on http://localhost:${PORT}`);
});
