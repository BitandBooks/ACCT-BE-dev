import { Controller, Get, Post, Body, Param, UseGuards, Request, Delete, ForbiddenException } from '@nestjs/common'
import { BookingsService } from './bookings.service'
import { CreateBookingDto } from './dto/create-booking.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
    constructor(private bookingsService: BookingsService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a booking for the authenticated user' })
    @Post()
    async create(@Request() req, @Body() dto: CreateBookingDto) {
        return this.bookingsService.create(req.user.id, dto)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "List bookings for the authenticated user" })
    @Get()
    async myBookings(@Request() req) {
        return this.bookingsService.findByUser(req.user.id)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get booking details (owner only)' })
    @Get(':id')
    async findOne(@Request() req, @Param('id') id: string) {
        const booking = await this.bookingsService.findOne(id)
        if (booking.userId !== req.user.id) throw new ForbiddenException()
        return booking
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cancel a booking (owner only)' })
    @Delete(':id')
    async cancel(@Request() req, @Param('id') id: string) {
        return this.bookingsService.cancel(req.user.id, id)
    }
}
