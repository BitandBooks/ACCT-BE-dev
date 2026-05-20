import { IsString, IsDateString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEventDto {
    @ApiPropertyOptional({ example: 'Updated title (EN)' })
    @IsOptional()
    @IsString()
    titleEn?: string;

    @ApiPropertyOptional({ example: 'Titre mis à jour (FR)' })
    @IsOptional()
    @IsString()
    titleFr?: string;

    @ApiPropertyOptional({ example: 'عنوان محدث (AR)' })
    @IsOptional()
    @IsString()
    titleAr?: string;

    @ApiPropertyOptional({ example: 'Updated description (EN)' })
    @IsOptional()
    @IsString()
    descriptionEn?: string;

    @ApiPropertyOptional({ example: 'Description mise à jour (FR)' })
    @IsOptional()
    @IsString()
    descriptionFr?: string;

    @ApiPropertyOptional({ example: 'الوصف المحدث (AR)' })
    @IsOptional()
    @IsString()
    descriptionAr?: string;

    @ApiPropertyOptional({ example: '2026-06-01T11:00:00Z', type: String })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ example: '2026-06-01T13:00:00Z', type: String })
    @IsOptional()
    @IsDateString()
    endDate?: string;

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

    @ApiPropertyOptional({ example: 120 })
    @IsOptional()
    @IsInt()
    @Min(0)
    capacity?: number;

    @ApiPropertyOptional({ example: 0 })
    @IsOptional()
    @IsInt()
    ticketPrice?: number;

    @ApiPropertyOptional({ example: 'draft' })
    @IsOptional()
    @IsString()
    status?: string;
}
