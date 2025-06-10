import { config } from '../config';

interface CreateCheckoutSessionResponse {
  checkoutSessionId: string;
  payloadJSON: string;
  signature: string;
}

const API_BASE = import.meta.env.PROD 
  ? 'https://generateYouTubecaptionsubtitlestext.netlify.app/api'
  : 'http://localhost:8787/api';

export async function createCheckoutSession(amount: number): Promise<CreateCheckoutSessionResponse> {
  try {
    const response = await fetch(`${API_BASE}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        merchantId: config.amazonPay.merchantId,
        storeId: config.amazonPay.storeId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function completeCheckout(checkoutSessionId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/complete-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkoutSessionId,
        merchantId: config.amazonPay.merchantId,
        storeId: config.amazonPay.storeId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to complete checkout');
    }
  } catch (error) {
    console.error('Error completing checkout:', error);
    throw error;
  }
} 