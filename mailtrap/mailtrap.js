import { MailtrapClient } from 'mailtrap'
import dotenv from "dotenv";


dotenv.config();

const TOKEN='d9bda798400a3e55b41a5213cb5c0307';
const ENDPOINT='https://send.api.mailtrap.io/';

console.log('TOKEN:', TOKEN);
console.log('ENDPOINT:', ENDPOINT);

export const mailTrapclient = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "TMT",
};
