import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async create(email: string, password: string) {
    const existUser = await this.userRepository.find({ email });
    console.log('User exist', existUser);
    console.log('email exist', email);
    console.log('password exist', password);
    if (existUser.length) {
      console.log('Here');
      throw new ConflictException('Error: The user is already registered!');
    }
    const user = await this.userRepository.create({ email, password });
    console.log('The user', user)
    return await this.userRepository.save(user);
  }
}
