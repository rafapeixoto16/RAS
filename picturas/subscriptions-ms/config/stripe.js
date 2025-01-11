import Stripe from 'stripe';

const stripeConf = {};

if (process.env.STRIPE_ENDPOINT) {
    stripeConf['host'] = process.env.STRIPE_ENDPOINT;
    stripeConf['port'] = process.env.STRIPE_ENDPOINT_PORT;
}

export const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY, stripeConf);

// Constants for pricing
const MONTHLY_PRICE = 999; // $9.99 in cents
const YEARLY_DISCOUNT = 0.17; // 17% discount
const CURRENCY = 'usd';
export const MONTHLY_INTERVAL = 'month';
export const YEARLY_INTERVAL = 'year';
export const INTERVALS = [MONTHLY_INTERVAL, YEARLY_INTERVAL];
export const TRIAL_DAYS = 30;

export const PLANS = {
    [MONTHLY_INTERVAL]: {
        amount: MONTHLY_PRICE,
        interval: MONTHLY_INTERVAL,
    },
    [YEARLY_INTERVAL]: {
        amount: Math.round(MONTHLY_PRICE * 12 * (1 - YEARLY_DISCOUNT)),
        interval: YEARLY_INTERVAL,
    },
};

export const stripeProductInfo = {
    productId: 'picturas-premium',
    [MONTHLY_INTERVAL]: null,
    [YEARLY_INTERVAL]: null
};

async function ensurePricing() {
    const productName = 'Premium Subscription';

    try {
        // Step 1: Check if the product exists
        let product;
        try {
            product = await stripe.products.retrieve(stripeProductInfo.productId);
            console.log(`Product "${productName}" already exists: ${product.id}`);
        } catch (error) {
            if (error.type === 'StripeInvalidRequestError') {
                console.log(`Product "${productName}" not found. Creating it...`);
                product = await stripe.products.create({
                    id: stripeProductInfo.productId,
                    name: productName,
                    description: 'Access to premium features.',
                });
                console.log(`Created product: ${product.id}`);
            } else {
                throw error;
            }
        }

        // Step 2: Ensure prices for all intervals
        for (const interval of INTERVALS) {
            const plan = PLANS[interval];

            try {
                // Check if price exists
                const prices = await stripe.prices.list({
                    product: product.id,
                    active: true,
                    limit: 10, // Optional: In case of many prices
                });

                let price = prices.data.find(
                    (p) => p.unit_amount === plan.amount && p.recurring?.interval === interval
                );

                if (!price) {
                    console.log(`Price for interval "${interval}" not found. Creating it...`);
                    price = await stripe.prices.create({
                        unit_amount: plan.amount,
                        currency: CURRENCY,
                        recurring: { interval: plan.interval },
                        product: product.id,
                    });
                    console.log(`Created price for interval "${interval}": ${price.id}`);
                } else {
                    console.log(`Price for interval "${interval}" already exists: ${price.id}`);
                }

                // Update stripeProductInfo with the price ID
                stripeProductInfo[interval] = price.id;
            } catch (error) {
                console.error(`Failed to ensure price for interval "${interval}":`, error);
                throw error;
            }
        }
    } catch (error) {
        console.error('Error ensuring pricing:', error);
        throw error;
    }
}

export function initStripe() {
    return ensurePricing();
}
