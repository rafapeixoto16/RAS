import { Stripe } from 'stripe';
import {
    addSubcription,
    getSubcriptionByEmail,
    updateSubcriptionByEmail,
} from '../controller/subscriptions.js';
import Subscription from '../models/subscriptionModel.js';

app.post('/create-subscription', async (req, res) => {
    const { interval, paymentMethodId, email } = req.body;
    if (
        !email ||
        !['monthly', 'yearly'].includes(interval) ||
        !paymentMethodId
    ) {
        return res.status(400).json({ error: 'Invalid request parameters' });
    }

    const userData = Subscription.getSubcriptionByEmail(email);

    const user = userData || {
        premium: false,
        plan: 'regular',
        trialUsed: false,
    };
    if (!user.trialUsed) user.trialUsed = true;

    //users[email] = user; // TODO we must store stripeId in here

    try {
        const customer = await stripe.customers.create({
            payment_method: paymentMethodId,
            email,
            invoice_settings: { default_payment_method: paymentMethodId },
        });

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${
                                interval.charAt(0).toUpperCase() +
                                interval.slice(1)
                            } Plan`,
                        },
                        unit_amount: PLANS[interval].amount,
                        recurring: { interval: PLANS[interval].interval },
                    },
                },
            ],
            metadata: { email },
            trial_period_days: user.trialUsed ? 0 : 7,
        });

        if (!userData) {
            const userDataUpdate = {
                email: email,
                premium: true, //fixme verify
                plan: interval,
                trialUsed: true,
                stripeId: subscription.id,
            };

            Subscription.addSubcription(userDataUpdate);
        }

        return res.json({ subscriptionId: subscription.id });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to create subscription' });
    }
});

app.get('/transaction-history', async (req, res) => {
    const { email } = req.query;
    const userData = Subscription.getSubcriptionByEmail(email);

    if (!email || !userData) {
        return res.status(400).json({ error: 'Invalid or unknown user' });
    }

    try {
        const invoices = await stripe.invoices.list({
            customer: (await stripe.customers.list({ email })).data[0]?.id,
        });

        const history = invoices.data.map((inv) => ({
            id: inv.id,
            amount_paid: inv.amount_paid,
            currency: inv.currency,
            status: inv.status,
            date: new Date(inv.created * 1000),
        }));

        return res.json({
            email,
            history,
        });
    } catch (err) {
        return res
            .status(500)
            .json({ error: 'Failed to fetch transaction history' });
    }
});

app.get('/billing-info', async (req, res) => {
    const { email } = req.query;
    const userData = Subscription.getSubcriptionByEmail(email);
    if (!email || !userData) {
        return res.status(400).json({ error: 'Invalid or unknown user' });
    }

    try {
        const customer = (await stripe.customers.list({ email })).data[0];
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const billingInfo = {
            name: customer.name,
            email: customer.email,
            payment_method: customer.invoice_settings.default_payment_method
                ? await stripe.paymentMethods.retrieve(
                      customer.invoice_settings.default_payment_method
                  )
                : null,
        };

        return res.json({
            email,
            billingInfo,
        });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch billing info' });
    }
});

app.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'invoice.payment_succeeded') {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        const subscription =
            await stripe.subscriptions.retrieve(subscriptionId);
        const { email } = subscription.metadata;

        const userData = Subscription.getSubcriptionByEmail(email);

        if (userData) {
            const userDataUpd = {
                ...userData,
                premium: true,
                plan:
                    subscription.items.data[0].price.unit_amount ===
                    PLANS.monthly.amount
                        ? 'monthly'
                        : 'yearly',
            };

            Subscription.updateSubcriptionByEmail(userData.email, userDataUpd);
        }
    } else if (event.type === 'invoice.payment_failed') {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        const subscription =
            await stripe.subscriptions.retrieve(subscriptionId);
        const { email } = subscription.metadata;

        const userData = Subscription.getSubcriptionByEmail(email);

        if (userData) {
            const userDataUpd = {
                ...userData,
                premium: false,
            };

            Subscription.updateSubcriptionByEmail(userData.email, userDataUpd);
        }
    } else if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object;
        const { email } = subscription.metadata;

        const userData = Subscription.getSubcriptionByEmail(email);

        if (userData) {
            const userDataUpd = {
                ...userData,
                premium: false,
                plan: 'regular',
            };

            Subscription.updateSubcriptionByEmail(userData.email, userDataUpd);
        }
    }

    return res.status(200);
});
