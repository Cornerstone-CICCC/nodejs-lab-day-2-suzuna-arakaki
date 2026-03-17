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
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserModel {
    constructor() {
        this.users = [];
    }
    // find by id
    findById(id) {
        return this.users.find((u) => u.id === id);
    }
    // findByUsername
    findByUsername(username) {
        return this.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    }
    // login
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUsername = this.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
            if (!foundUsername) {
                return null;
            }
            const isMatch = yield bcrypt_1.default.compare(password, foundUsername.password);
            if (!isMatch) {
                return null;
            }
            return foundUsername;
        });
    }
    // Create new user
    create(username, password, firstname, lastname) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = this.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
            if (found) {
                return null;
            }
            // password setting
            const hashedPassword = yield bcrypt_1.default.hash(password, 8);
            const newUser = {
                id: (0, uuid_1.v4)(),
                username,
                password: hashedPassword,
                firstname,
                lastname,
            };
            this.users = [...this.users, newUser];
            return newUser;
        });
    }
}
exports.default = new UserModel();
