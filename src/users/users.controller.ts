import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query, Session
} from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService, private authService: AuthService) {}

  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(createUserDto.email, createUserDto.password);
    session.userId = user.id;
    return user;
  }

  @Get('who')
  whoIAm(@CurrentUser() user: string) {
    return 'Hello Rafa';
  }

  // whoIAm(@Session() session: any) {
  //   return this.usersService.findOne(session.userId);
  // }

  @Post('signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signin')
  async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/id/:id')
  async findUser(@Param('id') id: string) {
    return await this.usersService.findOne(parseInt(id));
  }


  @Get()
  async findAll() {
    return await this.usersService.findAllUsers();
  }

  @Get('/email')
  async findAllByEmail(@Query('email') email: string) {
    console.log('here')
    return await this.usersService.findByEmail(email);
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(parseInt(id), updateUserDto);
  }

  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    return await this.usersService.remove(parseInt(id));
  }
}
