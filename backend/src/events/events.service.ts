import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.event.create({ data });
    }

    async findAll(skip = 0, take = 20) {
        return this.prisma.event.findMany({
            where: { status: 'published' },
            skip,
            take,
            orderBy: { startDate: 'asc' },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        const event = await this.prisma.event.findUnique({ where: { id } });
        if (!event) throw new NotFoundException('Event not found');
        return event;
    }

    async update(id: string, data: UpdateEventDto) {
        await this.findOne(id);
        return this.prisma.event.update({ where: { id }, data });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.event.delete({ where: { id } });
    }
}
