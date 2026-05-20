import { IsString, IsDateString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEventDto {
    @ApiPropertyOptional({ example: 'Updated title' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ example: 'Updated description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: '2026-06-01T11:00:00Z', type: String })
    @IsOptional()
    @IsDateString()
    startAt?: string;

    @ApiPropertyOptional({ example: '2026-06-01T13:00:00Z', type: String })
    @IsOptional()
    @IsDateString()
    endAt?: string;

    @ApiPropertyOptional({ example: 120 })
    @IsOptional()
    @IsInt()
    @Min(0)
    capacity?: number;
}
