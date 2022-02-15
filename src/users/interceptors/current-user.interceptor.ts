import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "../users.service";

export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    if (userId) {
      request.currentUser = await this.usersService.findOne(userId);
    }
    return next.handle();
  }

}