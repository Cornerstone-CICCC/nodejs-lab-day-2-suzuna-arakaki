import { User } from "../types/user.types";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

class UserModel {
  private users: User[] = [];

  // find by id
  findById(id: string) {
    return this.users.find((u) => u.id === id);
  }

  // findByUsername
  findByUsername(username: string) {
    return this.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    );
  }

  // login
  async login(username: string, password: string) {
    const foundUsername = this.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    );

    if (!foundUsername) {
      return null;
    }

    const isMatch: Boolean = await bcrypt.compare(
      password,
      foundUsername.password,
    );

    if (!isMatch) {
      return null;
    }

    return foundUsername;
  }

  // Create new user
  async create(
    username: string,
    password: string,
    firstname: string,
    lastname: string,
  ) {
    const found = this.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    );

    if (found) {
      return null;
    }

    // password setting
    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = {
      id: uuidv4(),
      username,
      password: hashedPassword,
      firstname,
      lastname,
    };
    this.users = [...this.users, newUser];
    return newUser;
  }
}

export default new UserModel();
