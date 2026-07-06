export default () => ({
    mail: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD,
    },
});