import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    async onModuleInit() {
        try {
            await this.$connect();
        } catch (err) {
            this.logger.warn('Prisma connection failed at startup; continuing without DB connection.');
        }
    }
    async onModuleDestroy() {
        try {
            await this.$disconnect();
        } catch (err) {
            this.logger.warn('Prisma disconnect failed during shutdown.');
        }
    }
}
