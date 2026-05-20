import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventsGateway } from '../gateway/events.gateway';

@Module({
    imports: [],
    controllers: [EventsController],
    providers: [EventsService, EventsGateway],
})
export class EventsModule { }
