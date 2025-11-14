// components/verification/steps/Step6Payment.tsx
'use client';

import { useState, useEffect } from 'react';
import { processPayment } from '@/lib/verification';

export default function Step6Payment({ formData, updateStep }: any) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [countdown, setCountdown] = useState(3);

  const handlePayment = async () => {
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
      const result = await processPayment(phoneNumber, 200); // KES 500
      
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

  const formatPhoneNumber = (value: string) => {
    // Remove non-digits and limit to 12 characters
    const digits = value.replace(/\D/g, '').slice(0, 12);
    
    // Ensure it starts with 254
    if (digits.length > 0 && !digits.startsWith('254')) {
      return '254' + digits.slice(3);
    }
    
    return digits;
  };

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
            Redirecting to dashboard in {countdown} second{countdown !== 1 ? 's' : ''}...
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
    <del className="text-gray-400 text-sm">KES 500.00</del>
    <span className="font-semibold text-green-600">KES 200.00</span>
  </div>
</div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service</span>
              <span className="font-semibold">Identity Verification</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-green-600">KES 200.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
          
          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
            <div>
              <h4 className="font-semibold text-green-900">M-Pesa</h4>
              <p className="text-green-700 text-sm">Pay instantly via M-Pesa</p>
            </div>
          </div>

          {/* Phone Number Input */}
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
                onClick={handlePayment}
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

        {/* Payment Status */}
        {paymentStatus === 'processing' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-blue-800">
                Processing payment... Check your phone for M-Pesa prompt
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
                  Please try again or use a different phone number. Ensure you have sufficient funds and your M-Pesa PIN is correct.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">Payment Instructions:</h4>
          <ul className="text-yellow-800 text-sm space-y-1">
            <li>• Ensure your M-Pesa account has sufficient funds</li>
            <li>• You will receive an M-Pesa prompt on your phone</li>
            <li>• Enter your M-Pesa PIN to complete payment</li>
            <li>• This fee is refundable if verification fails</li>
            <li>• Keep your phone nearby during payment processing</li>
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