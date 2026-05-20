import { IsString, IsDateString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
    @ApiProperty({ example: 'Community Meetup (EN)' })
    @IsString()
    titleEn: string;

    @ApiProperty({ example: 'Rencontre communautaire (FR)' })
    @IsString()
    titleFr: string;

    @ApiPropertyOptional({ example: 'لقاء المجتمع (AR)' })
    @IsOptional()
    @IsString()
    titleAr?: string;

    @ApiPropertyOptional({ example: 'An evening meetup for members (EN)' })
    @IsOptional()
    @IsString()
    descriptionEn?: string;

    @ApiPropertyOptional({ example: 'Une rencontre en soirée pour les membres (FR)' })
    @IsOptional()
    @IsString()
    descriptionFr?: string;

    @ApiPropertyOptional({ example: 'لقاء للمجتمع في المساء (AR)' })
    @IsOptional()
    @IsString()
    descriptionAr?: string;

    @ApiProperty({ example: '2026-06-01T10:00:00Z', type: String })
    @IsDateString()
    startDate: string;

    @ApiProperty({ example: '2026-06-01T12:00:00Z', type: String })
    @IsDateString()
    endDate: string;

    @ApiPropertyOptional({ example: 'community' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({ example: 'Main Hall' })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiPropertyOptional({ example: '123 Main St' })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({ example: 'Tunis' })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiProperty({ example: 100 })
    @IsInt()
    @Min(0)
    capacity: number;

    @ApiPropertyOptional({ example: 0 })
    @IsOptional()
    @IsInt()
    ticketPrice?: number;
}
