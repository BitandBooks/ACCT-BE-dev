import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateBookingDto } from './dto/create-booking.dto'

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: CreateBookingDto) {
        const { eventId, quantity = 1 } = dto

        const event = await this.prisma.event.findUnique({ where: { id: eventId } })
        if (!event) throw new NotFoundException('Event not found')

        // compute already booked quantity for this event
        const agg = await this.prisma.booking.aggregate({
            _sum: { quantity: true },
            where: { eventId },
        })
        const alreadyBooked = (agg._sum && agg._sum.quantity) ? agg._sum.quantity : 0

        if (typeof event.capacity === 'number' && (alreadyBooked + quantity) > event.capacity) {
            throw new BadRequestException('Not enough capacity for requested quantity')
        }

        const booking = await this.prisma.booking.create({
            data: {
                userId,
                eventId,
                quantity,
                totalPrice: 0,
                status: 'PENDING',
            },
        })

        return booking
    }

    async findByUser(userId: string) {
        return this.prisma.booking.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
    }

    async findOne(id: string) {
        const booking = await this.prisma.booking.findUnique({ where: { id } })
        if (!booking) throw new NotFoundException('Booking not found')
        return booking
    }

    async cancel(userId: string, id: string) {
        const booking = await this.findOne(id)
        if (booking.userId !== userId) throw new ForbiddenException('Not authorized to cancel this booking')
        return this.prisma.booking.update({ where: { id }, data: { status: 'CANCELLED' } })
    }
}
