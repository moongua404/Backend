import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalServiceStrategy } from './strategies/local-service.strategy';
import { JwtServiceStrategy } from './strategies/jwt-service.strategy';
import { GoogleStrategy } from './strategies/google.strategy';


@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule.register({ session: false }),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('SECRET_KEY'),
          signOptions: {expiresIn: '1w'},
        };
      },
      inject: [ConfigService],
    })
  ],
  providers: [AuthService, LocalServiceStrategy, JwtServiceStrategy, GoogleStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
