"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const zxcvbn_1 = __importDefault(require("zxcvbn"));
const getUserByUsername = (req, res) => {
    const username = req.params.username;
    const user = user_model_1.default.findByUsername(username);
    if (!user) {
        res.status(500).json({
            error: "Username not found!!",
        });
    }
    res.status(200).json(user);
};
const getLoginUser = (req, res) => {
    res.status(200).render("login");
};
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username.trim() || !password.trim()) {
        res.status(400).send("Username or password can not be empty!");
    }
    const loggedinUser = yield user_model_1.default.login(username, password);
    if (!loggedinUser) {
        res.status(400).send("User doesn't exist or your password is incorrect!");
    }
    res.cookie("isLoggedIn", true, {
        maxAge: 30 * 60 * 1000, // 30 minutes
        httpOnly: true,
        signed: true,
    });
    res.status(301).redirect("/loggedinHome");
});
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, firstname, lastname } = req.body;
    if (!username.trim() ||
        !password.trim() ||
        !firstname.trim() ||
        !lastname.trim()) {
        res.status(400).json({
            error: "Please fill out all informations.",
        });
        return;
    }
    const passwordScore = (0, zxcvbn_1.default)(password).score;
    if (passwordScore <= 2) {
        res.status(400).json({
            error: "Password is too weak",
        });
        return;
    }
    const newUser = yield user_model_1.default.create(username, password, firstname, lastname);
    if (!newUser) {
        res.status(500).json({
            error: "Username is taken... :(",
        });
        return;
    }
    res.status(200).json(newUser);
});
const logout = (req, res) => {
    res.clearCookie("isLoggedIn");
    res.clearCookie("message");
    if (req.session) {
        req.session = null;
    }
    res.status(301).redirect("login");
};
exports.default = {
    getUserByUsername,
    getLoginUser,
    loginUser,
    addUser,
    logout,
};
