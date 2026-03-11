import { Injectable, Logger, RawBodyRequest } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../../common/mail/mail.service';
import { Request } from 'express';

@Injectable()
export class BillingService {
    private readonly logger = new Logger(BillingService.name);
    private readonly stripe: Stripe;

    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
        private readonly mailService: MailService,
    ) {
        this.stripe = new Stripe(this.configService.get<string>('stripe.secretKey') || '', {
            apiVersion: '2024-06-20' as any,
        });
    }

    async createCheckoutSession(userId: string, tier: 'PRO' | 'TEAM') {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        const priceId =
            tier === 'PRO'
                ? this.configService.get<string>('stripe.proPriceId')
                : this.configService.get<string>('stripe.teamPriceId');

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${this.configService.get<string>('cors.origin')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${this.configService.get<string>('cors.origin')}/pricing`,
            client_reference_id: userId,
            customer_email: user.email,
            metadata: {
                userId,
                tier,
            },
        });

        return { url: session.url };
    }

    async handleWebhook(req: RawBodyRequest<Request>) {
        const sig = req.headers['stripe-signature'] as string;
        const webhookSecret = this.configService.get<string>('stripe.webhookSecret') || '';

        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(
                req.rawBody as Buffer,
                sig,
                webhookSecret,
            );
        } catch (err: any) {
            this.logger.error(`Webhook signature verification failed: ${err.message}`);
            throw new Error(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.client_reference_id;
            const tier = session.metadata?.tier as any;

            if (userId && tier) {
                const updated = await this.prisma.user.update({
                    where: { id: userId },
                    data: { tier },
                });
                this.logger.log(`User ${userId} upgraded to ${tier}`);

                // Send email
                this.mailService.sendUpgradeEmail(updated.email, tier).catch(err => {
                    this.logger.error(`Failed to send upgrade email to ${updated.email}`, err);
                });
            }
        }

        return { received: true };
    }
}
