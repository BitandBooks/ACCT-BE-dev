import { IsString, IsInt, Min, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateBookingDto {
    @IsString()
    eventId: string

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    quantity?: number
}
