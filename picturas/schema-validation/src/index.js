import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { jsonSchemaToZod } from 'json-to-zod-schema';

export { z as schemaValidation };

export function toJsonSchema(name, schema) {
    return zodToJsonSchema(schema, name);
}

export function fromJsonSchema(schema) {
    return jsonSchemaToZod(schema);
}

export const validateRequest = (schemas) => {
    return (req, res, next) => {
        const errors = [];
        const { params, query, body } = schemas;

        if (params) {
            const parsed = params.safeParse(req.params);
            if (!parsed.success) {
                errors.push({ type: 'Params', errors: parsed.error });
            }
        }
        if (query) {
            const parsed = query.safeParse(req.query);
            if (!parsed.success) {
                errors.push({ type: 'Query', errors: parsed.error });
            }
        }
        if (body) {
            const parsed = body.safeParse(req.body);
            if (!parsed.success) {
                errors.push({ type: 'Body', errors: parsed.error });
            }
        }
        if (errors.length > 0) {
            return res
                .status(400)
                .send(
                    errors.map((error) => ({
                        type: error.type,
                        errors: error.errors,
                    }))
                );
        }
        return next();
    };
};
