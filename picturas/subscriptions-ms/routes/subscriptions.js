import {Stripe} from 'stripe';
import * as Subscription from '../controller/subscriptions.js';
import {Router} from 'express';
import {requiresAuth} from "@picturas/ms-helper";

const BASE_PRICE = 999;

const PLANS = {
    monthly: {
        amount: BASE_PRICE,
        interval: 'month',
    },
    yearly: {
        amount: BASE_PRICE * 12 * 0.83,
        interval: 'year',
    }, // 17% discount for yearly
};

const stripeConf = {};

if (process.env.STRIPE_ENDPOINT) {
    stripeConf['host'] = process.env.STRIPE_ENDPOINT;
    stripeConf['port'] = process.env.STRIPE_ENDPOINT_PORT;
}

const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY, stripeConf);

const router = new Router();

router.get('/plans', (_, res) => {
    return res.status(200).json(PLANS);
})

const webhookInvoicePaymentSucceeded = async (req, res, invoice, subscriptionId) => {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const {userId} = subscription.metadata;

    const userData = await Subscription.getSubcriptionByUserId(userId);

    if (!userData) throw new Error();

    const userDataUpd = {
        ...userData,
        premium: true,
        plan:
            subscription.items.data[0].price.unit_amount ===
            PLANS.monthly.amount
                ? 'monthly'
                : 'yearly',
    };

    await Subscription.updateSubcriptionByUserId(userData.userId, userDataUpd);
}

const webhookInvoicePaymentFailed = async (req, res, invoice, subscriptionId) => {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const {userId} = subscription.metadata;

    const userData = Subscription.getSubcriptionByUserId(userId);

    if (!userData) throw new Error();

    const userDataUpd = {
        ...userData,
        premium: false,
    };

    await Subscription.updateSubcriptionByUserId(userData.userId, userDataUpd);
}

const webhookInvoiceSubscriptionDeleted = async (req, res, subscription) => {
    const {userId} = subscription.metadata;
    const userData = Subscription.getSubcriptionByUserId(userId);

    if (!userData) throw new Error();

    const userDataUpd = {
        ...userData,
        premium: false,
        plan: 'regular',
    };

    await Subscription.updateSubcriptionByUserId(userData.userId, userDataUpd);
}

router.post('/webhook', async (req, res) => {
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

    try {
        if (event.type === 'invoice.payment_succeeded') {
            const invoice = event.data.object;
            const subscriptionId = invoice.subscription;

            await webhookInvoicePaymentSucceeded(req, res, invoice, subscriptionId);
        } else if (event.type === 'invoice.payment_failed') {
            const invoice = event.data.object;
            const subscriptionId = invoice.subscription;

            await webhookInvoicePaymentFailed(req, res, invoice, subscriptionId);
        } else if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object;

            await webhookInvoiceSubscriptionDeleted(req, res, subscription)
        }
    } catch (_) {
        res.sendStatus(500);
    }

    return res.status(200);
});

// Requires Auth from now on
router.use(requiresAuth);

router.get('/', async (req, res) => {
    Subscription.getSubcriptionByUserId(req.user._id).then(userData => {
        let ctn = {
            trialUsed: false,
            isPremium: false,
            plan: 'regular'
        };

        if (userData) ctn = {
            trialUsed: userData.trialUsed,
            isPremium: userData.premium,
            plan: userData.plan
        };

        res.status(200).json(ctn);
    }).catch(_ => {
        res.sendStatus(500);
    });
})

router.post('/subscribe', async (req, res) => {
    const {interval, paymentMethodId} = req.body;
    const userId = req.user._id;

    if (
        !userId ||
        !['monthly', 'yearly'].includes(interval) ||
        !paymentMethodId
    ) {
        return res.status(400).json({error: 'Invalid request parameters'});
    }

    try {
        const userData = await Subscription.getSubcriptionByUserId(userId);

        const user = userData || {
            premium: false,
            plan: 'regular',
            trialUsed: false,
        };

        let customerId;

        if (userData) {
            customerId = userData.stripeId;
        } else {
            const customer = await stripe.customers.create({
                email: req.user.email,
                metadata: {userId},
                invoice_settings: {default_payment_method: paymentMethodId},
            });

            customerId = customer.id;
        }

        const subscription = await stripe.subscriptions.create({
            customer: customerId,
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
                        recurring: {interval: PLANS[interval].interval},
                    },
                },
            ],
            metadata: {userId},
            trial_period_days: user.trialUsed ? 0 : 7,
        });

        if (!userData) {
            const userDataUpdate = {
                userId: userId,
                premium: false,
                plan: 'regular',
                trialUsed: false,
                stripeId: subscription.id,
            };

            await Subscription.addSubcription(userDataUpdate);
        }

        return res.json({subscriptionId: subscription.id});
    } catch (err) {
        return res.status(500).json({error: 'Failed to create subscription'});
    }
});

router.get('/transactionHistory', async (req, res) => {
    try {
        const userId = req.user._id;

        const userData = await Subscription.getSubcriptionByUserId(userId);

        if (!userData) {
            return res.status(200).json([]);
        }

        const invoices = await stripe.invoices.list({
            customer: userData.stripeId,
        });

        const history = invoices.data.map((inv) => ({
            amount_paid: inv.amount_paid,
            currency: inv.currency,
            status: inv.status,
            date: new Date(inv.created * 1000),
        }));

        return res.json(history);
    } catch (err) {
        return res
            .status(500)
            .json({error: 'Failed to fetch transaction history'});
    }
});

router.get('/billingInfo', async (req, res) => {
    try {
        const userId = req.user._id;
        const userData = await Subscription.getSubcriptionByUserId(userId);

        let billingInfo = {};

        if (userData) {
            const customer = (await stripe.customers.list({customer: userData.stripeId})).data[0];

            if (customer.sources.length > 0) {
                billingInfo = {last4: customer.sources[0].data.last4, bankName: customer.sources[0].data.bank_name};
            }
        }

        return res.json(billingInfo);
    } catch (err) {
        return res.status(500).json({error: 'Failed to fetch billing info'});
    }
});

export default router;
