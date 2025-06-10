const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { config } = require('../src/config');

const app = express();
app.use(cors());
app.use(express.json());

// Create checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { amount, merchantId, storeId } = req.body;

    // Create payload
    const payload = {
      webCheckoutDetails: {
        checkoutResultReturnUrl: `${req.headers.origin}/checkout-success`
      },
      paymentDetails: {
        paymentIntent: 'Authorize',
        canHandlePendingAuthorization: false,
        chargeAmount: {
          amount: amount.toString(),
          currencyCode: 'USD'
        }
      },
      merchantMetadata: {
        merchantReferenceId: `caption-generation-${Date.now()}`,
        merchantStoreName: 'YouTube Caption Generator',
        noteToBuyer: 'Thank you for using our caption generation service!'
      }
    };

    const payloadJSON = JSON.stringify(payload);
    
    // In a real implementation, you would:
    // 1. Generate a signature using your private key
    // 2. Store the session in your database
    // 3. Return the session ID, payload, and signature
    
    // For demo purposes, we'll return a mock response
    res.json({
      checkoutSessionId: `mock-session-${Date.now()}`,
      payloadJSON,
      signature: 'mock-signature'
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Complete checkout
app.post('/api/complete-checkout', async (req, res) => {
  try {
    const { checkoutSessionId, merchantId, storeId } = req.body;

    // In a real implementation, you would:
    // 1. Verify the signature
    // 2. Update the session status in your database
    // 3. Process the payment
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error completing checkout:', error);
    res.status(500).json({ error: 'Failed to complete checkout' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 