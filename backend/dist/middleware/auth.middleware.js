"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsLoggedIn = void 0;
const checkIsLoggedIn = (req, res, next) => {
    const { isLoggedIn } = req.signedCookies;
    if (!isLoggedIn) {
        res.status(401).send("Log in to view this page!");
        return;
    }
    next();
};
exports.checkIsLoggedIn = checkIsLoggedIn;
