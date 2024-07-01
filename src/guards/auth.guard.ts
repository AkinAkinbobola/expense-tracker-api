// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { Request } from 'express';
// import { AuthService } from '../auth/auth.service';
//
// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private readonly authService: AuthService) {}
//
//   async canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const request: Request = context.switchToHttp().getRequest();
//     const token = this.extractRequestFromHeader(request);
//
//     if (!token) {
//       throw new UnauthorizedException('Invalid token');
//     }
//
//     try {
//       const response = await this.authService.validateUser({})
//     } catch (e) {
//       throw new UnauthorizedException('Invalid token');
//     }
//
//     return true;
//   }
//
//   private extractRequestFromHeader(request: Request): string | undefined {
//     return request.headers.authorization?.split(' ')[1];
//   }
// }
