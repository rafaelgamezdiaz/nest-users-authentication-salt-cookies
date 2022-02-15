import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async create(email: string, password: string) {
    // const existUser = await this.userRepository.find({ email });
    // if (existUser.length) {
    //   throw new ConflictException('Error: The user is already registered!');
    // }
    const user = await this.userRepository.create({ email, password });
    return await this.userRepository.save(user);
  }

  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException(`Error: Unauthorized!`)
    }
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepository.find({ email });
  }

  async findAllUsers() {
    return await this.userRepository.find();
  }

  async update(id: number, attr: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`There is not user with ID = ${id}`);
    }
    Object.assign(user, attr); // Override the new values in user
    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    console.log('remove', id)
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`There is not user with ID = ${id}`);
    }
    return await this.userRepository.remove(user);
  }
}
