import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiResponseDto, UserRequestDto } from './dto/ai_routine.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService
    ) {}
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({summary: '버전 체크 api', description: '버전을 반환한다'})
  @ApiResponse({ status: 200, description: 'get version'})
  @Get('version')
  versionCheck() {
    return this.configService.get('VERSION');
  }

  @ApiOperation({summary: '안내를 위한 swagger입니다. ', description: 'https://a43pwwzgih.execute-api.ap-northeast-2.amazonaws.com/default/AIRoutine'})
  @ApiBody({
    description: 'User info request data',
    type: UserRequestDto
  })
  @ApiResponse({
    status: 200,
    description: 'Successful response with workout routine',
    type: ApiResponseDto,
  })
  @Post('AI ROUTINE')
  async adsf(){
    
  }
}