import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        if (!user) throw new UnauthorizedException();
        if (user.role !== 'ADMIN') throw new ForbiddenException('Admin only');
        return true;
    }
}
