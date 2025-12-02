// components/verification/steps/Step6Payment.tsx
'use client';

import { useState, useEffect } from 'react';
import { processPayment } from '@/lib/verification';
import { CreditCard, Smartphone, ExternalLink } from 'lucide-react';

interface Step6PaymentProps {
  formData: any;
  updateStep: (step: number, data?: any) => void;
  role?: string;
  sessionId?: string | null;
}

export default function Step6Payment({ formData, updateStep, role = 'EMPLOYEE', sessionId }: Step6PaymentProps) {
  const isEmployer = role === 'EMPLOYER';
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [paymentWindow, setPaymentWindow] = useState<Window | null>(null);

  // Check for payment status from URL params (for Pesapal callback)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentParam = params.get('payment');

    if (paymentParam === 'success') {
      setPaymentStatus('success');
      // Auto-progress after success
      setTimeout(() => {
        updateStep(7, { paymentCompleted: true });
      }, 3000);
    } else if (paymentParam === 'failed') {
      setPaymentStatus('failed');
    }
  }, []);

  // Listen for messages from Pesapal popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify message is from our payment popup
      if (event.data.type === 'PESAPAL_PAYMENT_SUCCESS') {
        console.log('✅ Payment successful from popup:', event.data);
        setPaymentStatus('success');
        setProcessing(false);

        // Auto-progress after success
        setTimeout(() => {
          updateStep(7, {
            paymentCompleted: true,
            pesapalOrderId: event.data.orderTrackingId
          });
        }, 2000);
      } else if (event.data.type === 'PESAPAL_PAYMENT_FAILED') {
        console.log('❌ Payment failed from popup:', event.data);
        setPaymentStatus('failed');
        setProcessing(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [updateStep]);

  // M-Pesa Payment Handler (for workers)
  const handleMpesaPayment = async () => {
    if (!phoneNumber.trim()) {
      alert('Please enter your phone number');
      return;
    }

    if (!phoneNumber.startsWith('254')) {
      alert('Please enter a valid Kenyan phone number starting with 254');
      return;
    }

    if (phoneNumber.length !== 12) {
      alert('Please enter a valid 12-digit Kenyan phone number (254XXXXXXXXX)');
      return;
    }

    setProcessing(true);
    setPaymentStatus('processing');

    try {
      const result = await processPayment(phoneNumber, 200);

      if (result.success) {
        setPaymentStatus('success');

        // Start countdown and auto-progress
        let timer = 3;
        const countdownInterval = setInterval(() => {
          timer -= 1;
          setCountdown(timer);
          if (timer <= 0) {
            clearInterval(countdownInterval);
            updateStep(7, {
              paymentCompleted: true,
              mpesaNumber: phoneNumber,
              transactionCode: result.checkoutRequestID
            });
          }
        }, 1000);
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
    } finally {
      setProcessing(false);
    }
  };

  // Pesapal Payment Handler (for employers)
  const handlePesapalPayment = async () => {
    setProcessing(true);
    setPaymentStatus('processing');

    try {
      // Get user from session storage
      const userStr = sessionStorage.getItem('user');
      if (!userStr) {
        throw new Error('User not found');
      }
      const user = JSON.parse(userStr);

      // Submit order to Pesapal
      const response = await fetch('/api/payment/pesapal/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          amount: 15, // $15 USD
          currency: 'USD',
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment order');
      }

      console.log('✅ Pesapal order created:', data);

      // Open Pesapal payment page in new window
      const width = 800;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;

      const newWindow = window.open(
        data.redirect_url,
        'PesapalPayment',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );

      setPaymentWindow(newWindow);

      // Monitor payment window - no need to reload, postMessage will handle it
      const checkWindow = setInterval(() => {
        if (newWindow && newWindow.closed) {
          clearInterval(checkWindow);
          // Only set processing to false if payment status hasn't been updated
          if (paymentStatus === 'processing') {
            setProcessing(false);
            console.log('⚠️ Payment window closed without status update');
          }
        }
      }, 1000);

    } catch (error: any) {
      console.error('Pesapal payment error:', error);
      alert(error.message || 'Failed to initiate payment');
      setPaymentStatus('failed');
      setProcessing(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 12);
    if (digits.length > 0 && !digits.startsWith('254')) {
      return '254' + digits.slice(3);
    }
    return digits;
  };

  // Success Screen
  if (paymentStatus === 'success') {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">
          Your verification payment has been processed successfully. Your application is now being reviewed.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800 font-medium">
            You will receive a confirmation message shortly.
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            Redirecting to completion in {countdown} second{countdown !== 1 ? 's' : ''}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Complete Verification
        </h2>
        <p className="text-gray-600">
          Final step: Pay the verification fee to complete your application
        </p>
      </div>

      <div className="space-y-6">
        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Verification Fee</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-600">
                  {isEmployer ? '$15.00' : 'KES 200.00'}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service</span>
              <span className="font-semibold">Identity Verification</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-green-600">
                  {isEmployer ? '$15.00' : 'KES 200.00'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method - M-Pesa for Workers */}
        {!isEmployer && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>

            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900">M-Pesa</h4>
                <p className="text-green-700 text-sm">Pay instantly via M-Pesa</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                M-Pesa Phone Number *
              </label>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                    placeholder="254712345678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                    maxLength={12}
                  />
                </div>
                <button
                  onClick={handleMpesaPayment}
                  disabled={processing || phoneNumber.length !== 12}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-32"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Pay Now'
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Enter your M-Pesa registered phone number (12 digits starting with 254)
              </p>
            </div>
          </div>
        )}

        {/* Payment Method - Pesapal Card for Employers */}
        {isEmployer && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>

            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-[#117c82]/10 to-[#FDB913]/10 rounded-lg border-2 border-[#117c82]/30 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#117c82] to-[#0d9ea6] rounded-lg flex items-center justify-center shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-[#117c82]">Card Payment</h4>
                <p className="text-gray-700 text-sm">Pay securely with Visa, Mastercard, or other cards</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#117c82]/5 to-[#FDB913]/5 rounded-lg p-4 border border-[#117c82]/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#117c82] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-[#117c82] mb-1">Secure Payment</h5>
                    <p className="text-sm text-gray-600">
                      Your payment is processed securely through Pesapal. We never store your card details.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePesapalPayment}
                disabled={processing}
                className="w-full bg-gradient-to-r from-[#117c82] to-[#0d9ea6] hover:from-[#0d9ea6] hover:to-[#117c82] text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Opening Payment Page...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-3" />
                    Pay with Card
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                <span>Powered by</span>
                <span className="font-bold text-[#117c82]">Pesapal</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Status */}
        {paymentStatus === 'processing' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-blue-800">
                {isEmployer
                  ? 'Processing payment... Complete payment in the popup window'
                  : 'Processing payment... Check your phone for M-Pesa prompt'}
              </p>
            </div>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">❌</div>
              <div>
                <p className="text-red-800 font-medium">Payment failed</p>
                <p className="text-red-700 text-sm mt-1">
                  Please try again or contact support if the issue persists.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">Payment Instructions:</h4>
          <ul className="text-yellow-800 text-sm space-y-1">
            {isEmployer ? (
              <>
                <li>• Click "Pay with Card" to open the secure payment page</li>
                <li>• Enter your card details in the popup window</li>
                <li>• Complete the payment to verify your account</li>
                <li>• You will be redirected back automatically</li>
                <li>• This fee is refundable if verification fails</li>
              </>
            ) : (
              <>
                <li>• Ensure your M-Pesa account has sufficient funds</li>
                <li>• You will receive an M-Pesa prompt on your phone</li>
                <li>• Enter your M-Pesa PIN to complete payment</li>
                <li>• This fee is refundable if verification fails</li>
                <li>• Keep your phone nearby during payment processing</li>
              </>
            )}
          </ul>
        </div>

        {/* Back Button */}
        <div className="flex justify-start pt-4">
          <button
            onClick={() => updateStep(5)}
            disabled={processing}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            Back to Details
          </button>
        </div>
      </div>
    </div>
  );
}