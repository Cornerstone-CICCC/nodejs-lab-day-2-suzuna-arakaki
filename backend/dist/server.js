"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Create your server
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cookie_session_1 = __importDefault(require("cookie-session"));
// import path from "path";
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SIGN_KEY));
const COOKIE_SESSION_KEY1 = process.env.COOKIE_SESSION_KEY1;
const COOKIE_SESSION_KEY2 = process.env.COOKIE_SESSION_KEY2;
if (!COOKIE_SESSION_KEY1 || !COOKIE_SESSION_KEY2) {
    throw new Error("Missing cookie sessions keys!");
}
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: [COOKIE_SESSION_KEY1, COOKIE_SESSION_KEY2],
    maxAge: 3 * 60 * 1000, // 3 minutes
    httpOnly: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/user", user_routes_1.default);
app.use((req, res, next) => {
    res.status(404).send("Sorry, Invalid port!");
});
const PORT = process.env.PORT;
if (!PORT) {
    throw new Error("Missing Port");
}
app.listen(PORT, () => {
    console.log(`This server is running on http://localhost:${PORT}`);
});
