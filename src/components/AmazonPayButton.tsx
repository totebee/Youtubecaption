import { useEffect, useRef } from 'react';
import { Box, Button, useToast } from '@chakra-ui/react';
import { config } from '../config';

declare global {
  interface Window {
    amazon: {
      Pay: {
        renderButton: (container: HTMLElement, options: any) => void;
        bindChangeAction: (options: any) => void;
      };
    };
  }
}

interface AmazonPayButtonProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: any) => void;
}

export default function AmazonPayButton({ amount, onSuccess, onError }: AmazonPayButtonProps) {
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  useEffect(() => {
    // Load Amazon Pay SDK
    const script = document.createElement('script');
    script.src = 'https://static-na.payments-amazon.com/OffAmazonPayments/us/js/Widgets.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (buttonContainerRef.current) {
        window.amazon.Pay.renderButton(buttonContainerRef.current, {
          merchantId: config.amazonPay.merchantId,
          publicKeyId: config.amazonPay.publicKeyId,
          ledgerCurrency: 'USD',
          checkoutLanguage: 'en_US',
          productType: 'PayAndShip',
          placement: 'Cart',
          buttonColor: 'Gold',
          buttonType: 'PwA',
          createCheckoutSessionConfig: {
            payloadJSON: JSON.stringify({
              webCheckoutDetails: {
                checkoutResultReturnUrl: window.location.origin + '/checkout-success'
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
                merchantReferenceId: 'caption-generation-' + Date.now(),
                merchantStoreName: 'YouTube Caption Generator',
                noteToBuyer: 'Thank you for using our caption generation service!'
              }
            }),
            signature: '', // This should be generated on your backend
            publicKeyId: config.amazonPay.publicKeyId
          }
        });

        // Bind change action
        window.amazon.Pay.bindChangeAction({
          amazonCheckoutSessionId: 'checkoutSessionId', // This will be set dynamically
          changeAction: 'authorize',
          webCheckoutDetails: {
            checkoutResultReturnUrl: window.location.origin + '/checkout-success'
          }
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [amount]);

  return (
    <Box>
      <div ref={buttonContainerRef} />
    </Box>
  );
} 