import { Hono } from 'hono';
import bot from '@/core/bot';

const app = new Hono();

app.route('/', bot);

export default bot;