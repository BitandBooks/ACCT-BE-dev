import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { HealthModule } from './health/health.module';

@Module({
    imports: [PrismaModule, AuthModule, EventsModule, BookingsModule, PaymentsModule, HealthModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
