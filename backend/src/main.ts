import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);
    // capture raw request body for webhook signature verification
    app.use(express.json({
        verify: (req: any, res, buf: Buffer) => {
            req.rawBody = buf;
        },
    }));
    app.setGlobalPrefix('api');
    app.enableCors({ origin: true, credentials: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    // enable graceful shutdown hooks so restart signals (ts-node-dev, nodemon) close the server
    app.enableShutdownHooks();
    const shutdown = async (signal?: string) => {
        console.log(`Received ${signal ?? 'shutdown'} signal, closing app...`);
        try {
            await app.close();
        } catch (err) {
            console.error('Error during shutdown:', err);
        } finally {
            // exit to ensure the process terminates for dev tools that expect it
            process.exit(0);
        }
    };
    ['SIGINT', 'SIGTERM', 'SIGUSR2'].forEach((s) => process.on(s, () => shutdown(s)));

    const config = new DocumentBuilder()
        .setTitle('ACCT Platform API')
        .setDescription('Association Culturelle Canado-Tunisienne Platform API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Listening on ${port}`);
}

bootstrap();
