export default () => ({
    app: {
        name: process.env.APP_NAME ?? 'CamTontine API',
        port: parseInt(process.env.PORT ?? '3000', 10),
        nodeEnv: process.env.NODE_ENV ?? 'development',
    },
});