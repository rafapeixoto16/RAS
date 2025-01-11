// based on https://docs.stripe.com/billing/subscriptions/build-subscriptions
// and https://docs.stripe.com/payments/accept-a-payment-deferred?type=subscription

import {stripe, INTERVALS, PLANS, stripeProductInfo, TRIAL_DAYS} from '../config/stripe.js';
import * as Subscription from '../controller/subscriptions.js';
import {Router} from 'express';
import {requiresAuth} from "@picturas/ms-helper";
import {schemaValidation, validateRequest} from '@picturas/schema-validation';

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
        trialUSed: true,
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
// TODO
//router.use(requiresAuth);
router.use((req,res,next) => {
    req.user = {
        'name': 'demo',
        'email': 'demo@demo.com',
        '_id': '64d0d02167d49b2512345678'
    };
    next();
});

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
});

router.post('/subscribe', validateRequest({
    body: schemaValidation.object({
        interval: schemaValidation.enum(INTERVALS)
    })
}), async (req, res) => {
    const userId = req.user._id;

    try {
        const subData = await Subscription.getSubcriptionByUserId(userId);

        let sub = subData || {
            userId,
            premium: false,
            plan: 'regular',
            trialUsed: false,
        };

        let customerId;

        if (subData) {
            if (subData.subscriptionId) return res.sendStatus(400);

            customerId = subData.stripeId;
        } else {
            const customer = await stripe.customers.create({
                email: req.user.email,
                metadata: {userId}
            });

            customerId = sub.stripeId = customer.id;

            sub = await Subscription.addSubcription(sub);
        }

        const subscriptionData = {
            customer: customerId,
            items: [{
                price: stripeProductInfo[req.body.interval]
            }],
            metadata: {userId},

            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
        };

        if (!sub.trialUsed) {
            subscriptionData.trial_period_days = TRIAL_DAYS;
        }

        const subscription = await stripe.subscriptions.create(subscriptionData);

        sub.subscriptionId = subscription.id;
        await Subscription.updateSubcription(sub._id, sub);

        if (subscription.pending_setup_intent !== null) {
            res.send({
                type: 'setup',
                clientSecret: subscription.pending_setup_intent.client_secret,
            });
        } else {
            res.send({
                type: 'payment',
                clientSecret: subscription.latest_invoice.payment_intent.client_secret,
            });
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({error: 'Failed to create subscription'});
    }
});

router.delete('/cancelSubscription', async (req, res) => {
    try {
        const data = await Subscription.getSubcriptionByUserId(req.user._id)

        if(!data) return res.sendStatus(404);

        const deletedSubscription = await stripe.subscriptions.del(data.subscriptionId);

        data.subscriptionId = null;

        await Subscription.updateSubcriptionByUserId(req.user._id,data)

        res.send(deletedSubscription);
    }catch (_){
        res.sendStatus(567);
    }
});

// TESTING
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

// TESTING
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
