import { Controller, Post, Body, UseGuards, Request, Req, Res, HttpCode } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import Stripe from 'stripe'
import { Request as ExRequest, Response as ExResponse } from 'express'
import { PrismaService } from '../prisma/prisma.service'

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
    constructor(private paymentsService: PaymentsService, private prisma: PrismaService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a payment intent for a booking' })
    @Post('create-intent')
    async createIntent(@Request() req, @Body() body: { bookingId: string; amount: number; currency?: string }) {
        const { bookingId, amount, currency } = body
        return this.paymentsService.createPaymentIntent(req.user.id, bookingId, amount, currency)
    }

    // Stripe webhook endpoint — must use raw body for verification
    @HttpCode(200)
    @Post('webhook')
    async webhook(@Req() req: ExRequest, @Res() res: ExResponse) {
        const sig = req.headers['stripe-signature'] as string
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''
        const rawBody = (req as any).rawBody
        try {
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET || '', { apiVersion: '2022-11-15' })
            const event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)

            // Record event id for idempotency. If the record already exists, skip processing.
            try {
                const created = await (this.prisma as any).webhookEvent.createMany({ data: [{ eventId: event.id, type: event.type }], skipDuplicates: true })
                if (created && created.count === 0) {
                    // duplicate event delivery — already processed
                    console.log('Duplicate webhook event skipped', event.id)
                    return res.send({ received: true, skipped: true })
                }
            } catch (err) {
                // If the WebhookEvent table doesn't exist yet (migration pending), log and continue.
                console.warn('WebhookEvent dedupe unavailable, continuing without dedupe:', err?.message ?? err)
            }

            await this.paymentsService.handleWebhookEvent(event)
            res.send({ received: true })
        } catch (err: any) {
            console.error('Webhook error', err?.message ?? err)
            res.status(400).send(`Webhook Error: ${err?.message ?? err}`)
        }
    }
}
