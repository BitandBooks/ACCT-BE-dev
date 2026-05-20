import { IsString, IsDateString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
    @ApiProperty({ example: 'Community Meetup' })
    @IsString()
    title: string;

    @ApiPropertyOptional({ example: 'An evening meetup for members' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: '2026-06-01T10:00:00Z', type: String })
    @IsDateString()
    startAt: string;

    @ApiProperty({ example: '2026-06-01T12:00:00Z', type: String })
    @IsDateString()
    endAt: string;

    @ApiProperty({ example: 100 })
    @IsInt()
    @Min(0)
    capacity: number;
}
