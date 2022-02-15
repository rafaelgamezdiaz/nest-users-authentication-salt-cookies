import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { promisify } from "util";
import { randomBytes, scrypt as _scrypt } from "crypto";

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // Check if email is already in use
    const userExist = await this.usersService.findByEmail(email);
    if (userExist.length) {
      throw new BadRequestException(`Email in use`);
    }

    // Hash the user password
    // Generates the salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const saltAndHashedPassword = salt + '.' + hash.toString('hex');

    // Creates a new user and save it
    // Returns the user
    return await this.usersService.create(email, saltAndHashedPassword);
  }

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = await scrypt(password, salt, 32) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Wrong password');
    }
    return user;
  }
}