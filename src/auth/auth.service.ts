import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Payload } from './payload/payload.interface';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private jwtService: JwtService,
    ) {}

    async postJoin(createUserDto: CreateUserDto) {
        return await this.userRepository.save(createUserDto);
    }

    async checkPassword(createUserDto: CreateUserDto){
        let min_password = 8;
        if (createUserDto.password.length < min_password){
            console.log("short password");
            return false;
        }
        let hasUppercase = /[A-Z]/.test(createUserDto.password);
        let hasLowercase = /[a-z]/.test(createUserDto.password);
        let hasNumber = /[0-9]/.test(createUserDto.password);
        let hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(createUserDto.password);
        let characterTypes = [hasUppercase, hasLowercase, hasNumber, hasSpecial];
        let numberOfTypes = characterTypes.filter(Boolean).length;
        if (numberOfTypes < 3) {
            return false;
        }
        return true;
    }
    
    async hashing(createUserDto: CreateUserDto){
        createUserDto.password = await bcrypt.hash(createUserDto.password, 11);
        return createUserDto;
    }

    async validateServiceUser(id: string, password: string): Promise<any> {
        const user = await this.userRepository.findOne({where:{user_id: id}})
        if (!user) {
            throw new ForbiddenException(`there's no user with id ${id}`);
        }
        if (!(await bcrypt.compare(password, user.password))) {
            throw new ForbiddenException('password is not matched');
        }
        return user;
    }
    async loginServiceUser(user: User) {
        const payload = {
            id: user.user_id,
            nickname: user.nickname
        }

        return {
            token: this.jwtService.signAsync(payload),
        }
    }
    async generateRefreshToken(user: User) {
        const payload = {
            id: user.user_id,
        }
        return this.jwtService.signAsync({id: payload.id}, {
            secret: this.configService.get('SECRET_KEY'),
            expiresIn: '2w',
        }

        )
    }

    async refresh(refreshTokenDto: RefreshTokenDto): Promise<{ acessToken: string }> {
        const { refresh_token } = refreshTokenDto;
        const decodeRefreshToken = this.jwtService.verify(refresh_token, {secret: this.configService.get('SECRET_KEY')}) as Payload;
        const user_id = decodeRefreshToken.user_id;
        const user = await this.userRepository.findOne({where:{user_id: user_id}});
        if (!user) {
            throw new UnauthorizedException();
        }
        const accessToken = await this.generateRefreshToken(user);
        return {acessToken: accessToken};
    }

    async googleLogin(req, res){
        let user = await this.userRepository.findOne({where: {'user_id': await req.user.providerId}});
        if (!user) {
            const input = {
                user_id: await req.user.providerId,
                nickname: null,
                is_man: null,
                d_day: null,
                password: null,
            } as CreateUserDto;
            user = await this.postJoin(input);
        }
        return await this.loginServiceUser(user);
    }

    async findJwtUser(req){
        let token: string = req.headers['authorization'].replace('Bearer ', '');
        const decodeToken = this.jwtService.verify(token,  {secret: this.configService.get('SECRET_KEY')})
        return await this.userRepository.findOne({where:{user_id: decodeToken.user_id}});
    }

    async deleteUser(user: User){
        await this.userRepository.delete({user_id: user.user_id});
    }

    async saveUserData(req: Request, user: User){
        let userData = await this.findJwtUser(req);
        userData.nickname = user.nickname;
        userData.is_man = user.is_man;
        userData.d_day = user.d_day;
        await this.userRepository.save(userData);
    }
}