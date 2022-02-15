import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { AuthService } from "./auth.service";
import { CurrentUserInterceptor } from "./interceptors/current-user.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService, {
    provide: APP_INTERCEPTOR,        // This lines apply the CurrentUserInterceptor globally to the scope of controllers, not only to this module
    useClass: CurrentUserInterceptor
  }]
})
export class UsersModule {}
