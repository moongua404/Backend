import { IsString, IsObject, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WorkoutItemDto {
  @ApiProperty({ example: '컨벤셔널 데드리프트' })
  @IsString()
  exercise_name: string;

  @ApiProperty({ example: '3세트' })
  @IsString()
  sets: string;

  @ApiProperty({ example: '10회' })
  @IsString()
  repetitions: string;

  @ApiProperty({ example: '체중의 70%' })
  @IsString()
  weight: string;

  @ApiProperty({ example: '80칼로리' })
  @IsString()
  calories_burned: string;
}

export class WorkoutRoutineDto {
  @ApiProperty({ example: '60분' })
  @IsString()
  exercise_duration: string;

  @ApiProperty({ example: '주 3~4회' })
  @IsString()
  exercise_frequency: string;

  @ApiProperty({ example: '8개' })
  @IsString()
  total_exercises: string;

  @ApiProperty({ example: '500칼로리' })
  @IsString()
  total_calories_burned: string;

  @ApiProperty({ type: [WorkoutItemDto] })
  @IsArray()
  workout_routine: WorkoutItemDto[];
}

export class UserInfoDto {
  @ApiProperty({ example: '남성' })
  @IsString()
  sex: string;

  @ApiProperty({ example: '건강한몸' })
  @IsString()
  body_type: string;

  @ApiProperty({ example: '3~6개월' })
  @IsString()
  experience: string;

  @ApiProperty({ example: '21개 이상' })
  @IsString()
  pushup_count: string;

  @ApiProperty({ example: '주 3~4회' })
  @IsString()
  workout_frequency: string;
}

export class UserRequestDto {
  @ApiProperty({ type: UserInfoDto })
  user_info: UserInfoDto;
}

export class ResponseHeadersDto {
  @ApiProperty({ example: 'application/json' })
  @IsString()
  'Content-Type': string;

  @ApiProperty({ example: '*' })
  @IsString()
  'Access-Control-Allow-Origin': string;

  @ApiProperty({ example: 'Content-Type' })
  @IsString()
  'Access-Control-Allow-Headers': string;

  @ApiProperty({ example: 'OPTIONS,POST,GET' })
  @IsString()
  'Access-Control-Allow-Methods': string;
}

export class ResponseBodyDto {
  @ApiProperty({ type: WorkoutRoutineDto })
  workout_routine: WorkoutRoutineDto;
}

export class ApiResponseDto {
  @ApiProperty({ example: 200 })
  @IsString()
  statusCode: number;

  @ApiProperty({ type: ResponseHeadersDto })
  headers: ResponseHeadersDto;

  @ApiProperty({ type: String })
  @IsString()
  body: string;
}
