import { stripe } from '../config/stripe.js';
import * as Subscription from '../controller/subscriptions.js';
import {Router} from 'express';
import {schemaValidation, validateRequest} from '@picturas/schema-validation';

const router = new Router();

router.delete('/deleteAccount', (req, res) => {
    Subscription.getSubcriptionByUserId(req.body.userId).then(async userData => {
        if (userData && userData.subscriptionId) {
            await stripe.subscriptions.cancel(data._doc.subscriptionId);
            await Subscription.deleteSubcriptionByUserId(req.body.userId)
        }

        res.sendStatus(200);
    }).catch(_ => {
        res.sendStatus(500);
    });
})

export default router;
