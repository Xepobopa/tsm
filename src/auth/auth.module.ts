import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TokenModule } from '../token/token.module';
import {AuthController} from "./auth.controller";
import { UsersModule } from "../user/users.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    TokenModule,
    ConfigModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: []
})
export class AuthModule {
}