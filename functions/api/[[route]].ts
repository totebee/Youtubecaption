import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/cloudflare-workers';

const app = new Hono();

// Enable CORS
app.use('*', cors());

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

// Amazon Pay endpoints
app.post('/api/amazon-pay/create-checkout', async (c) => {
  try {
    const body = await c.req.json();
    // TODO: Implement Amazon Pay checkout creation
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to create checkout' }, 500);
  }
});

// Caption generation endpoints
app.post('/api/captions/generate', async (c) => {
  try {
    const body = await c.req.json();
    // TODO: Implement caption generation
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to generate captions' }, 500);
  }
});

// Export the handler
export default {
  fetch: handle(app)
}; 