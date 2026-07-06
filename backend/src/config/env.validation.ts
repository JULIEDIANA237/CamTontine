import * as Joi from 'joi';

export const validationSchema = Joi.object({
    APP_NAME: Joi.string().default('CamTontine API'),

    PORT: Joi.number().default(3000),

    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),

    DATABASE_URL: Joi.string().required(),

    JWT_ACCESS_SECRET: Joi.string().required(),

    JWT_REFRESH_SECRET: Joi.string().required(),

    JWT_ACCESS_EXPIRES_IN: Joi.string().required(),

    JWT_REFRESH_EXPIRES_IN: Joi.string().required(),

    SMTP_HOST: Joi.string().allow('').optional(),

    SMTP_PORT: Joi.number().optional(),

    SMTP_USER: Joi.string().allow('').optional(),

    SMTP_PASSWORD: Joi.string().allow('').optional(),
});