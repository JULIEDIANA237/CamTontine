import app from './app.config';
import database from './database.config';
import jwt from './jwt.config';
import mail from './mail.config';

export default () => ({
    ...app(),
    ...database(),
    ...jwt(),
    ...mail(),
});