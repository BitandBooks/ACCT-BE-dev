import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async health() {
        const timestamp = new Date().toISOString();
        let database = { status: 'unknown' };
        try {
            // lightweight check
            await this.prisma.$queryRaw`SELECT 1`;
            database = { status: 'ok' };
        } catch (err) {
            database = { status: 'unavailable' };
        }

        return {
            status: 'ok',
            timestamp,
            service: 'acct-backend',
            database,
        };
    }
}
