import { ApiProperty } from "@nestjs/swagger";

export class FindDietDto {
    @ApiProperty()
    log_date: Date;
}