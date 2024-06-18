import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User_diets } from 'src/entities/user_diets.entity';
import { Repository } from 'typeorm';
import { dietDto } from './dto/diet.dto';
import { DeleteDieWithIdtDto, DeleteDieWithTypeDto } from './dto/delete-diet.dto';

@Injectable()
export class DietService {
    constructor(
        @InjectRepository(User_diets)
        private readonly user_dietRepository: Repository<User_diets>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ){}
    async findWithDay(day: Date, req: Request){
        let token: string = req.headers['authorization'].replace('Bearer ', '');
        const decodedToken = this.jwtService.verify(token, {secret: this.configService.get('SECRET_KEY')});
        let diets = await this.user_dietRepository.find({where: {user_id: decodedToken.id, log_date: day}});
        return diets;
    }
    async findAll(req: Request){
        let token: string = req.headers['authorization'].replace('Bearer ', '');
        const decodedToken = this.jwtService.verify(token, {secret: this.configService.get('SECRET_KEY')});
        let diets = await this.user_dietRepository.find({where: {user_id: decodedToken.id}});
        return diets;
    }
    async saveData(data: dietDto){
        return await this.user_dietRepository.save(data);
    }
    async getUserId(req: Request){
        let token: string = req.headers['authorization'].replace('Bearer ', '');
        const decodedToken = this.jwtService.verify(token, {secret: this.configService.get('SECRET_KEY')});
        return decodedToken.id;
    }
    async deleteDietWithId(id: number){
        return await this.user_dietRepository.delete({diet_id: id})
    }

    async deleteDietWithType(data: DeleteDieWithTypeDto, req: Request){
        let user = await this.getUserId(req);
        let diet = await this.user_dietRepository.findOne({where: {user_id: user, diet_type: data.diet_type, log_date: data.log_date}})
        console.log(diet)
        if (diet == null) { return null }
        return await this.deleteDietWithId(diet.diet_id);
    }
    

}