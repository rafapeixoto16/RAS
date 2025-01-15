import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { jsonSchemaToZod } from 'json-schema-to-zod';

export { z as schemaValidation };

export function toJsonSchema(name, schema) {
    return zodToJsonSchema(schema, name);
}

export function fromJsonSchema(name, schema) {
    return eval(jsonSchemaToZod(schema.definitions[name]));
}

const defaultSettings = {strict: true}

export const validateRequest = (schemas, settings={}) => {
    const finalSettings = {...defaultSettings, ...settings};

    return (req, res, next) => {
        const errors = [];
        const { params, query, body } = schemas;

        const validations = [
            { type: 'Params', schema: params, data: req.params },
            { type: 'Query', schema: query, data: req.query },
            { type: 'Body', schema: body, data: req.body }
        ];
          
        validations.forEach(({ type, schema, data }) => {
            if (!schema) return;

            let val = schema;
            
            if (finalSettings.strict) val.strict();
            
            const parsed = val.safeParse(data);

            if (!parsed.success) errors.push({ type, errors: parsed.error.issues });
        });

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
