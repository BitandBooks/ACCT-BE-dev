import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import Stripe from 'stripe'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PaymentsService {
    private stripe: Stripe
    constructor(private prisma: PrismaService) {
        const key = process.env.STRIPE_SECRET_KEY || ''
        this.stripe = new Stripe(key, { apiVersion: '2022-11-15' })
    }

    async createPaymentIntent(userId: string, bookingId: string, amount: number, currency = 'USD') {
        const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } })
        if (!booking) throw new NotFoundException('Booking not found')
        if (booking.userId !== userId) throw new BadRequestException('Booking does not belong to user')

        if (!amount || amount <= 0) throw new BadRequestException('Invalid amount')

        const intent = await this.stripe.paymentIntents.create({
            amount,
            currency: (currency || 'USD').toLowerCase(),
            metadata: { bookingId },
        })

        const payment = await this.prisma.payment.create({
            data: {
                bookingId,
                stripePaymentIntentId: intent.id,
                amount,
                currency: (currency || 'USD').toUpperCase(),
                status: 'CREATED',
            },
        })

        return { clientSecret: intent.client_secret, payment }
    }

    async handleWebhookEvent(event: Stripe.Event) {
        const type = event.type
        if (type === 'payment_intent.succeeded' || type === 'payment_intent.payment_failed') {
            const pi = event.data.object as Stripe.PaymentIntent
            const intentId = pi.id
            const amount = pi.amount ?? 0
            const bookingId = pi.metadata?.bookingId

            const payment = await this.prisma.payment.findFirst({ where: { stripePaymentIntentId: intentId } })
            if (!payment) {
                // create a payment record if missing (idempotent-ish)
                if (!bookingId) return
                await this.prisma.payment.create({
                    data: {
                        bookingId,
                        stripePaymentIntentId: intentId,
                        amount,
                        currency: (pi.currency || 'usd').toUpperCase(),
                        status: type === 'payment_intent.succeeded' ? 'SUCCEEDED' : 'FAILED',
                    },
                })
                if (type === 'payment_intent.succeeded') {
                    await this.prisma.booking.update({ where: { id: bookingId }, data: { status: 'PAID' } })
                }
                return
            }

            // idempotent update
            const newStatus = type === 'payment_intent.succeeded' ? 'SUCCEEDED' : 'FAILED'
            if (payment.status === newStatus) return
            await this.prisma.payment.update({ where: { id: payment.id }, data: { status: newStatus } })
            if (newStatus === 'SUCCEEDED') {
                await this.prisma.booking.update({ where: { id: payment.bookingId }, data: { status: 'PAID' } })
            }
        }
    }
}
