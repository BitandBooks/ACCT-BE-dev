import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('events')
@Controller('events')
export class EventsController {
    constructor(private eventsService: EventsService) { }

    @ApiOperation({ summary: 'List events' })
    @ApiResponse({ status: 200, description: 'List of events' })
    @Get()
    async findAll() {
        return this.eventsService.findAll();
    }

    @ApiOperation({ summary: 'Get event by id' })
    @ApiResponse({ status: 200, description: 'Event details' })
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.eventsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create an event (authenticated)' })
    @Post()
    async create(@Request() req, @Body() dto: CreateEventDto) {
        const data = { ...dto, createdById: req.user.id };
        return this.eventsService.create(data);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update an event (admin only)' })
    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
        return this.eventsService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete an event (admin only)' })
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.eventsService.remove(id);
    }
}
